"use client";

import Link from "next/link";
import { BookOpen, Check, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="test-shell">
      <Link className="test-back" href={`/poems/${poem.id}`}>
        <ChevronLeft size={23} />
        默写测试
      </Link>
      <p className="test-progress-label">第 2 / 4 题</p>
      <div className="test-progress" aria-label="第 2 / 4 题">
        <span />
      </div>
      <p className="prompt-label">请默写下句</p>
      <h1 className="test-prompt-line">{prompt.promptLine}</h1>
      <div className="test-ornament" aria-hidden="true" />
      <form onSubmit={submit}>
        <div className="panel answer-card">
          <label className="answer-line">
            <span className="answer-check">
              <Check size={23} />
            </span>
            <input
              className="answer-input"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="请输入下一句"
              aria-label="输入下一句"
              disabled={done}
              maxLength={20}
            />
          </label>
          <span className="answer-count">{answer.length} / 20</span>
        </div>
        {feedback ? (
          <div className={`feedback-card ${done ? "success" : "error"}`}>
            <CheckCircle2 size={46} />
            <p>
              <strong>{done ? "回答正确！" : "还差一点"}</strong>
              {done ? "太棒了，继续保持！" : feedback}
            </p>
          </div>
        ) : null}
        <div className="test-actions">
          <Link className="button secondary" href={`/poems/${poem.id}`}>
            查看解析
          </Link>
          {done ? (
            <Link className="button" href="/review-book">
              下一题
              <ChevronRight size={18} />
            </Link>
          ) : (
            <button className="button" type="submit" disabled={!answer.trim()}>
              下一题
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </form>
      <aside className="panel reminder-card">
        <BookOpen size={38} />
        <div>
          <h2>本次默写完成后将加入复习册</h2>
          <p>完成全部 4 题后，可在复习册中巩固复习</p>
        </div>
      </aside>
      <p className="test-tip">小贴士：遇到不会的诗句，可以先跳过，完成所有题目后再回头复习。</p>
    </div>
  );
}
