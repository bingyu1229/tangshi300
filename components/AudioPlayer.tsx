"use client";

import { Volume2 } from "lucide-react";
import type { PoemAudio } from "@/lib/types";

export function AudioPlayer({ audio, text }: { audio?: PoemAudio; text: string }) {
  function speak() {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  }

  if (audio?.status === "ready" && audio.filePath) {
    return (
      <div className="audio-box">
        <audio controls preload="none" src={audio.filePath}>
          您的浏览器不支持音频播放。
        </audio>
        <p className="feedback">
          {audio.model} · {audio.speaker}
        </p>
      </div>
    );
  }

  return (
    <div className="audio-box">
      <button className="button secondary" type="button" onClick={speak}>
        <Volume2 size={18} />
        朗读诗词
      </button>
      <p className="feedback">Qwen3-TTS 音频尚未生成，当前使用浏览器朗读兜底。</p>
    </div>
  );
}
