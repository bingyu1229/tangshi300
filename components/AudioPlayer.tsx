"use client";

import { Play, Volume2 } from "lucide-react";
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
      <div className="audio-row">
        <button className="play-button" type="button" aria-label="播放诗词音频">
          <Play size={18} fill="currentColor" />
        </button>
        <div className="audio-track" aria-hidden="true" />
        <span className="audio-time">00:00 / {audio.durationMs ? `${Math.round(audio.durationMs / 1000)}s` : "00:32"}</span>
        <Volume2 size={18} color="#6d665e" aria-hidden="true" />
        <audio controls preload="none" src={audio.filePath} className="sr-audio">
          您的浏览器不支持音频播放。
        </audio>
      </div>
    );
  }

  return (
    <div className="audio-row">
      <button className="play-button" type="button" onClick={speak} aria-label="朗读诗词">
        <Play size={18} fill="currentColor" />
      </button>
      <div className="audio-track" aria-hidden="true" />
      <span className="audio-time">00:00 / 00:32</span>
      <Volume2 size={18} color="#6d665e" aria-hidden="true" />
    </div>
  );
}
