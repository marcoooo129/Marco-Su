"use client";

import { useLayoutEffect } from "react";

// 从首页（Lenis 掌管滚动、可能停在很靠下的位置）跳进文章页时，
// document 的滚动位置会被带过来，导致文章一进来就在底部。
// 挂载即在绘制前把窗口拉回顶部，从文章开头读起。
export function ScrollTop() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
