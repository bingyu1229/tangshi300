"use client";

import Link from "next/link";
import { Check, Send } from "lucide-react";
import { useState } from "react";
import type { PoemDetail, TestPrompt } from "@/lib/types";

export function TestClient({ poem, prompt }: { poem: PoemDetail; prompt: TestPrompt }) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(`/api/poems/${poem.id}/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptLineIndex: prompt.promptLineIndex, answer }),
    });
    const result = (await response.json()) as { correct: boolean; expected: string };

    if (result.correct) {
      setDone(true);
      setFeedback("默写正确，已加入复习册。");
    } else {
      setFeedback(`还差一点，正确下句是：${result.expected}`);
    }
  }

  return (
    <div className="panel">
      <p className="section-title">默写测试</p>
      <h1 className="poem-title">{poem.title}</h1>
      <p className="poem-meta">{poem.author}</p>
      <div className="test-prompt">{prompt.promptLine}</div>
      <form className="stack" onSubmit={submit}>
        <input
          className="answer-input"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="请输入下一句"
          aria-label="输入下一句"
          disabled={done}
        />
        <button className="button" type="submit" disabled={done || !answer.trim()}>
          {done ? <Check size={18} /> : <Send size={18} />}
          {done ? "已完成" : "提交"}
        </button>
      </form>
      {feedback ? <p className={`feedback ${done ? "success" : "error"}`}>{feedback}</p> : null}
      {done ? (
        <div className="actions">
          <Link className="button secondary" href="/review-book">
            查看复习册
          </Link>
          <Link className="button ghost" href="/">
            返回今日推荐
          </Link>
        </div>
      ) : null}
    </div>
  );
}
