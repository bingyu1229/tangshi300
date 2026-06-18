"use client";

import Link from "next/link";
import { Check, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import { useState } from "react";
import type { PoemDetail, TestPrompt } from "@/lib/types";

export function TestClient({ poem, prompt }: { poem: PoemDetail; prompt: TestPrompt }) {
  const totalQuestions = Math.max(1, poem.lines.length - 1);
  const [promptLineIndex, setPromptLineIndex] = useState(prompt.promptLineIndex);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correct, setCorrect] = useState(false);
  const currentQuestion = Math.min(promptLineIndex + 1, totalQuestions);
  const promptLine = poem.lines[promptLineIndex] ?? prompt.promptLine;
  const progressPercent = Math.round((currentQuestion / totalQuestions) * 100);
  const isLastQuestion = currentQuestion >= totalQuestions;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (correct) {
      nextQuestion();
      return;
    }

    const response = await fetch(`/api/poems/${poem.id}/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptLineIndex, answer }),
    });
    const result = (await response.json()) as { correct: boolean; expected: string };

    if (result.correct) {
      setCorrect(true);
      setFeedback("默写正确，已加入复习册。");
    } else {
      setCorrect(false);
      setFeedback(`还差一点，正确下句是：${result.expected}`);
    }
  }

  function nextQuestion() {
    if (isLastQuestion) {
      return;
    }

    setPromptLineIndex((index) => Math.min(index + 1, totalQuestions - 1));
    setAnswer("");
    setFeedback("");
    setCorrect(false);
  }

  return (
    <div className="test-shell">
      <Link className="test-back" href={`/poems/${poem.id}`}>
        <ChevronLeft size={23} />
        默写测试
      </Link>
      <p className="test-progress-label">
        第 {currentQuestion} / {totalQuestions} 题
      </p>
      <div
        className="test-progress"
        aria-label={`第 ${currentQuestion} / ${totalQuestions} 题`}
        style={{ "--test-progress": `${progressPercent}%` } as CSSProperties}
      >
        <span />
      </div>
      <p className="prompt-label">请默写下句</p>
      <h1 className="test-prompt-line">{promptLine}</h1>
      <div className="test-ornament" aria-hidden="true" />
      <form onSubmit={submit}>
        <div className={`panel answer-card ${feedback && !correct ? "is-error" : ""} ${correct ? "is-correct" : ""}`}>
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
              readOnly={correct}
              maxLength={20}
            />
          </label>
          <span className="answer-count">{answer.length} / 20</span>
        </div>
        {feedback ? (
          <div className={`feedback-card ${correct ? "success" : "error"}`}>
            <CheckCircle2 size={46} />
            <p>
              <strong>{correct ? "回答正确！" : "还差一点"}</strong>
              {correct ? "太棒了，继续保持！" : feedback}
            </p>
          </div>
        ) : null}
        <div className="test-actions">
          {correct && isLastQuestion ? (
            <Link className="button" href="/review-book">
              完成
              <ChevronRight size={18} />
            </Link>
          ) : (
            <button className="button" type="submit" disabled={!answer.trim()}>
              {correct ? "下一题" : "提交"}
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </form>
      <p className="test-tip">小贴士：遇到不会的诗句，可以先跳过，完成所有题目后再回头复习。</p>
    </div>
  );
}
