"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  const goBack = () => {
    // 有站内历史就返回上一页，否则回首页 About
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/#about");
    }
  };

  return (
    <button type="button" className="article-back focus-ring" onClick={goBack}>
      <span aria-hidden="true">←</span>
      <span>Back</span>
    </button>
  );
}
