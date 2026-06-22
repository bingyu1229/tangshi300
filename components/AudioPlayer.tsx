"use client";

import { Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { PoemAudio } from "@/lib/types";

export function AudioPlayer({ audio, text }: { audio?: PoemAudio; text: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(audio?.durationMs ? audio.durationMs / 1000 : 32);
  const hasAudioFile = audio?.status === "ready" && Boolean(audio.filePath);
  const progress = durationSeconds > 0 ? Math.min(100, (currentSeconds / durationSeconds) * 100) : 0;

  useEffect(() => {
    const node = audioRef.current;
    if (!node) return;

    function updateTime() {
      setCurrentSeconds(node?.currentTime ?? 0);
    }

    function updateDuration() {
      if (node?.duration && Number.isFinite(node.duration)) {
        setDurationSeconds(node.duration);
      }
    }

    function markEnded() {
      setIsPlaying(false);
      setCurrentSeconds(0);
    }

    node.addEventListener("timeupdate", updateTime);
    node.addEventListener("loadedmetadata", updateDuration);
    node.addEventListener("ended", markEnded);

    return () => {
      node.removeEventListener("timeupdate", updateTime);
      node.removeEventListener("loadedmetadata", updateDuration);
      node.removeEventListener("ended", markEnded);
    };
  }, [audio?.filePath]);

  useEffect(() => {
    if (hasAudioFile || !isPlaying) return;

    const timer = window.setInterval(() => {
      setCurrentSeconds((seconds) => Math.min(durationSeconds, seconds + 0.25));
    }, 250);

    return () => window.clearInterval(timer);
  }, [durationSeconds, hasAudioFile, isPlaying]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (utteranceRef.current && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  async function toggleAudioFile() {
    const node = audioRef.current;
    if (!node) return;

    if (isPlaying) {
      node.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await node.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  function toggleSpeech() {
    if (!("speechSynthesis" in window)) {
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      return;
    }

    if (utteranceRef.current && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    setCurrentSeconds(0);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.82;
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentSeconds(0);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      utteranceRef.current = null;
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }

  const label = hasAudioFile ? "播放或暂停诗词音频" : "播放或暂停诗词朗读";

  return (
    <div className="audio-row" style={{ "--audio-progress": `${progress}%` } as CSSProperties}>
      <button className="play-button" type="button" onClick={hasAudioFile ? toggleAudioFile : toggleSpeech} aria-label={label} aria-pressed={isPlaying}>
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
      </button>
      <div className="audio-track" aria-hidden="true" />
      <span className="audio-time">
        {formatTime(currentSeconds)} / {formatTime(durationSeconds)}
      </span>
      <Volume2 size={18} color="#6d665e" aria-hidden="true" />
      {hasAudioFile ? (
        <audio preload="metadata" src={audio?.filePath} className="sr-audio" ref={audioRef}>
          您的浏览器不支持音频播放。
        </audio>
      ) : null}
    </div>
  );
}

function formatTime(seconds: number) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
