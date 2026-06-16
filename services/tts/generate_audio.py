from __future__ import annotations

import argparse
import json
import os
import sqlite3
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import soundfile as sf
import torch


MODEL_NAME = "Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice"
DEFAULT_SPEAKERS = ("Serena", "Uncle_Fu")
DB_PATH = Path("data/tangshi300.sqlite")
SOX_DIRS = (
    Path(r"C:\Program Files (x86)\sox-14-4-2"),
    Path(r"C:\Program Files\sox-14-4-2"),
)


def ensure_sox_on_path() -> None:
    existing = os.environ.get("PATH", "")
    for sox_dir in SOX_DIRS:
        if sox_dir.joinpath("sox.exe").exists() and str(sox_dir) not in existing:
            os.environ["PATH"] = f"{sox_dir}{os.pathsep}{existing}"
            return


def poem_text(poem: dict[str, Any]) -> str:
    content = poem.get("content") or "\n".join(poem.get("lines", []))
    return f"《{poem['title']}》，{poem['author']}。\n{content}"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def pick_speaker(poem_id: str, speakers: tuple[str, ...]) -> str:
    score = sum((index + 1) * ord(char) for index, char in enumerate(poem_id))
    return speakers[score % len(speakers)]


def existing_audio(poem_id: str) -> dict[str, Any] | None:
    if not DB_PATH.exists():
        return None

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        row = conn.execute("SELECT * FROM poem_audio WHERE poem_id = ?", (poem_id,)).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def upsert_audio(
    poem_id: str,
    speaker: str,
    file_path: str,
    status: str,
    duration_ms: int | None = None,
    error: str | None = None,
) -> None:
    if not DB_PATH.exists():
        return

    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute(
            """
            INSERT INTO poem_audio(id, poem_id, speaker, model, file_path, duration_ms, status, error_message, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              file_path = excluded.file_path,
              duration_ms = excluded.duration_ms,
              status = excluded.status,
              error_message = excluded.error_message
            """,
            (
                f"audio-{poem_id}",
                poem_id,
                speaker,
                MODEL_NAME,
                file_path,
                duration_ms,
                status,
                error,
                now_iso(),
            ),
        )
        conn.commit()
    finally:
        conn.close()


def load_model() -> Any:
    ensure_sox_on_path()
    from qwen_tts import Qwen3TTSModel

    return Qwen3TTSModel.from_pretrained(
        MODEL_NAME,
        device_map="cpu",
        dtype=torch.float32,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate cached poem audio with Qwen3-TTS.")
    parser.add_argument("--input", required=True, help="Path to tangshi300-v1-sample.json")
    parser.add_argument("--output-dir", default="public/audio", help="Audio output directory")
    parser.add_argument("--start", type=int, default=1, help="1-based start index in the input poem list")
    parser.add_argument("--count", type=int, default=0, help="Number of poems to process from --start")
    parser.add_argument("--limit", type=int, default=0, help="Optional generation limit for smoke tests")
    parser.add_argument("--force", action="store_true", help="Regenerate audio even if the file already exists")
    parser.add_argument("--language", default="Chinese")
    parser.add_argument("--max-new-tokens", type=int, default=2048)
    parser.add_argument(
        "--speakers",
        default="Serena,Uncle_Fu",
        help="Comma-separated speaker names. Each poem gets a stable random speaker from this list.",
    )
    parser.add_argument(
        "--instruct",
        default="用沉稳清晰的中文朗读唐诗，停顿自然，语气含蓄。",
        help="Optional generation instruction",
    )
    args = parser.parse_args()

    poems = json.loads(Path(args.input).read_text(encoding="utf-8"))
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    start_index = max(args.start - 1, 0)
    if args.count:
        selected = poems[start_index : start_index + args.count]
    elif args.limit:
        selected = poems[start_index : args.limit]
    else:
        selected = poems[start_index:]
    speakers = tuple(speaker.strip() for speaker in args.speakers.split(",") if speaker.strip()) or DEFAULT_SPEAKERS

    print(f"Model: {MODEL_NAME}", flush=True)
    print(f"Speakers: {', '.join(speakers)}", flush=True)
    print("Device: cpu; dtype: float32", flush=True)
    print(f"Poems queued: {len(selected)}", flush=True)

    print("Loading model...", flush=True)
    model = load_model()
    print("Model loaded.", flush=True)
    generated = 0
    skipped = 0
    failed = 0

    for index, poem in enumerate(selected, start=start_index + 1):
        poem_id = poem["id"]
        output_path = output_dir / f"{poem_id}.wav"
        public_path = f"/audio/{poem_id}.wav"
        speaker = pick_speaker(poem_id, speakers)

        if output_path.exists() and not args.force:
            audio_row = existing_audio(poem_id)
            speaker_for_row = str(audio_row.get("speaker")) if audio_row else speaker
            duration_for_row = int(audio_row["duration_ms"]) if audio_row and audio_row.get("duration_ms") else None
            skipped += 1
            upsert_audio(poem_id, speaker_for_row, public_path, "ready", duration_ms=duration_for_row)
            print(f"[{index}/{len(selected)}] skip {poem['title']} ({speaker_for_row}) -> {output_path}", flush=True)
            continue

        print(f"[{index}/{len(selected)}] generating {poem['title']} with {speaker}...", flush=True)
        started = time.time()
        try:
            wavs, sample_rate = model.generate_custom_voice(
                text=poem_text(poem),
                language=args.language,
                speaker=speaker,
                instruct=args.instruct,
                max_new_tokens=args.max_new_tokens,
            )
            wav = wavs[0]
            sf.write(output_path, wav, sample_rate)
            duration_ms = int(len(wav) / sample_rate * 1000)
            upsert_audio(poem_id, speaker, public_path, "ready", duration_ms=duration_ms)
            generated += 1
            print(f"    ok {duration_ms / 1000:.1f}s audio, {time.time() - started:.1f}s elapsed", flush=True)
        except Exception as exc:
            failed += 1
            upsert_audio(poem_id, speaker, public_path, "failed", error=str(exc))
            print(f"    failed: {exc}", flush=True)

    print(f"Done. generated={generated}, skipped={skipped}, failed={failed}", flush=True)


if __name__ == "__main__":
    main()
