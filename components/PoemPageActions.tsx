"use client";

import { BookOpen, PenLine, Printer, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type PoemPageActionsProps = {
  poemId: string;
};

export function PoemPageActions({ poemId }: PoemPageActionsProps) {
  const [pageUrl, setPageUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  async function copyUrl() {
    const url = pageUrl || window.location.href;

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function printPoem() {
    window.print();
  }

  return (
    <div className="detail-toolbar">
      <div className="utility-actions">
        <button className="icon-button" type="button" onClick={copyUrl}>
          <Share2 size={17} /> {copied ? "已复制" : "分享"}
        </button>
        <button className="icon-button" type="button" onClick={printPoem}>
          <Printer size={17} /> 打印
        </button>
      </div>
      <div className="detail-actions">
        <Link className="button" href={`/poems/${poemId}/test`}>
          <PenLine size={18} />
          开始默写
        </Link>
        <Link className="button secondary" href="/review-book">
          <BookOpen size={18} />
          加入复习册
        </Link>
      </div>
      <p className="print-url">页面地址：{pageUrl}</p>
    </div>
  );
}
