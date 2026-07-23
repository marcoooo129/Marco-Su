# CLAUDE.md — Marco Su Portfolio（L1 根契约）

> 每次开工先读这份。**约束在前，内容在后。**
> 项目状态：**LIVE**（marco-su.vercel.app）→ 见 §6 存量项目开关。

---

## 1. 这是什么

电影化滚动叙事的个人作品集。单页 8 幕 + 静态博客子页。
主角是一台可交互的 3D CRT 电视：跟随鼠标转视角、滚动推进镜头、机身旋钮切换昼夜。

## 2. 技术栈（不可替换，换栈=重开项目）

| 层 | 选型 | 说明 |
|---|---|---|
| 框架 | Next.js 15 App Router + TypeScript | 严格模式 |
| 样式 | 手写 CSS + CSS 自定义属性 | Tailwind **仅**用于 `sr-only` 等工具类 |
| 动画 | GSAP + ScrollTrigger | **唯一**动画框架，不得引入第二套 |
| 滚动 | Lenis（经 `gsap.ticker` 驱动） | 全局单例挂 `window.__lenis` |
| 3D | three.js + @react-three/fiber + @react-three/drei | |
| 字体 | @fontsource 本地化 | Space Mono（标题）/ IBM Plex Mono（UI）。**例外**：`app/opengraph-image.tsx` 用 `next/og`，Satori 无内置等宽字体，构建期会向 Google Fonts 取字；无网环境会超时并回退默认字体（构建仍成功，仅 OG 卡片字形不同） |
| 部署 | Vercel | `vercel.json` 已固定 `framework: nextjs` |

## 3. 目录

```
app/            路由（见 app/CLAUDE.md）
components/     组件（见 components/CLAUDE.md）
data/site.ts    ★ 全站唯一内容源
app/globals.css ★ 全站唯一设计令牌源
public/models/  crt-tv.glb（2.6MB，已压缩）
scripts/        optimize-glb.js
docs/PIPELINE.md 分阶段生产流水线
```

★ = 跨模块契约文件，文件头有 L3 契约注释。

---

## 4. 硬约束（违反即返工）

### 4.1 颜色
- **禁止在组件/CSS 中新增硬编码颜色**。所有颜色必须来自 `app/globals.css` 的令牌：
  `--page --ink --muted --line --grid --accent --hero --hero-ink --hero-dim --paper --paper-ink --hair --dim --body`
- 需要新颜色 → 先在 `:root` 与 `:root[data-theme="light"]` **两套主题里都加**，再引用。
- 只加背景不加文字色 = 关灯后黑底黑字（真实事故，见 PIPELINE 陷阱 13）。

**例外白名单**（只有这些地方允许字面量颜色，因为运行时读不到 CSS 变量）：

| 文件 | 原因 |
|---|---|
| `components/CRTScene.tsx` | canvas 2D 屏幕贴图 + three.js 灯光色 |
| `components/PixelTrail.tsx` | canvas 2D 像素填充 |
| `components/GlitchTransition.tsx` | canvas 噪点像素数据 |
| `components/FuzzyText.tsx` | prop 默认值（调用方会覆盖） |
| `components/TurntableLab.tsx` | three.js 材质/背景（`/turntable-lab` 实验页） |
| `app/opengraph-image.tsx` | Satori 构建期渲染，无 CSS 上下文 |
| `app/layout.tsx` | `viewport.themeColor` 必须字面量 |

### 4.2 排版
- 字号一律 `clamp(min, vw, max)`，**禁止裸 `vw`**。
  裸 `vw` 在 430px 大屏手机会比 375px 更大 → 排版崩坏（真实事故）。
- 字体只用两款：`"Space Mono"`（display）/ `"IBM Plex Mono"`（UI）。
- 巨型标题的 grid 容器必须 `grid-template-columns: minmax(0, 1fr)`，
  否则隐藏占位层里的 `nowrap` 长词会撑破列并被裁切（真实事故）。

### 4.3 动画
- 只动 `transform` / `opacity`。禁止动画 `width/height/top/left`。
- 滚动动画一律走 GSAP ScrollTrigger；**不要**用原生 `scroll` 监听做位移。
- 所有动画必须有 `prefers-reduced-motion` 降级路径。
- 入场遮罩（`overflow:hidden`）只在动画期间施加，`onComplete` 撤掉，
  否则会裁掉 `g/p/y` 的下降部（真实事故）。

### 4.4 滚动
- 程序化滚动一律 `window.__lenis.scrollTo(...)`，不要 `window.scrollTo` 或 `scrollIntoView`
  （例外：新路由挂载时的强制回顶，见 `components/ScrollTop.tsx`）。
- 任何"锁滚动"必须抽出 `unlock()`，并保证**每一条关闭路径**都调用它。

### 4.5 3D
- 3D 点击热区**必须**用 R3F 射线拾取（不可见 mesh + `onClick`）。
  **禁止**用 CSS 3D 变换过的 DOM 按钮当热区——浏览器命中测试会与视觉错位（真实事故）。
- `<Html>` 里的装饰层整棵子树 `pointer-events: none`。
- 每个 3D 交互都要配一个 `sr-only` 真按钮，保证键盘/读屏可用。
- `<Canvas frameloop>` 必须由 IntersectionObserver 门控（离屏 `never`），否则离屏仍满帧渲染。
- 不要用 `getBoundingClientRect()` 测 `<Html transform>` 内的元素（返回未变换盒子），
  用 `camera.project()` 算屏幕坐标。

### 4.6 内容
- 所有文案来自 `data/site.ts`，组件内**禁止**写死用户可见文案。
- 不为经历虚构量化结果。

### 4.7 层级
- `z-index` 只用令牌：`--z-base/content/overlay/nav/cursor/intro`。

---

## 5. 每次改动的收尾动作

1. `npx tsc --noEmit` 通过
2. 若跑过 `next build` → **必须** `rm -rf .next` 并重启 dev（否则 dev 报 `Cannot find module './xxx.js'`）
3. 若新增/删除组件 → 同步 `components/CLAUDE.md`
4. 若新增/删除路由 → 同步 `app/CLAUDE.md`
5. 若改了跨模块契约（`site.ts` / `globals.css` / `SmoothScrollProvider` / `CRTScene`）→ 更新其文件头 L3 注释

> L3 契约只维护这 4 个文件。其余文件的依赖关系从 import/export 自读，手工维护必然 drift。

---

## 6. 存量项目开关

本项目**已上线且有真实访问**。因此：
- ✅ 允许：重构实现、替换视觉、调整动效
- ⚠️ 需谨慎：改路由路径（`/notes/[slug]` 已被索引）、改 `data/site.ts` 字段名
- ❌ 禁止：为"更优雅"而破坏已上线的 URL 结构

> 新建项目可放开这条；有存量用户的库不要套用"历史包袱是枷锁"那套。

---

## 7. 安全

- `.gitignore` 已排除：`node_modules .next out dist .env* .vercel .claude docs/codex-chats`
- **任何密钥都不进仓库**。Vercel 凭据由 CLI 本地 keyring 管理，`.vercel/` 不提交。
- 私人工作记录（对话日志、简历原件）不进公开仓库。
