# components/ — L2 模块契约

> 只维护"有谁 / 各管什么 / 谁是跨模块契约"。实现细节看代码，不在这里复述。
> 新增或删除组件时**必须**同步本文件。

## 编排层

| 组件 | 职责 |
|---|---|
| `PortfolioExperience` | 首页总编排：装配 8 幕 + 主题状态 + 回顶重播 |
| `SmoothScrollProvider` | ★ Lenis 单例，挂 `window.__lenis`，经 `gsap.ticker` 驱动 |

## 幕（按滚动顺序）

| 组件 | 幕 | 关键约束 |
|---|---|---|
| `IntroSequence` | 01 开场 | sessionStorage 一次性；每条关闭路径都要 `unlock()` |
| `HeroTerminal` | 02 主角 | 持有 `diveProgressRef`，喂给 3D；`use3D` 分支决定 3D/CSS 降级 |
| `GlitchTransition` | 03 转场 | 一次性闪现（<1s），闪白时程序化跳转 |
| `ManifestoSection` | 04 宣言 | 标题 grid 必须 `minmax(0,1fr)`；隐藏占位层锁高度 |
| `ProjectsRail` | 05 项目 | 桌面 pin + 横向；距离按 `scrollWidth` 实算 |
| `TypeTransition` | 06 巨字 | 单次横穿，禁止跑马灯循环 |
| `AboutSection` | 07 关于 | 编辑式编号清单 + Notes 列表 |
| `ContactSection` | 08 联系 | CTA + 社交卡片 + 页脚 |

## 3D

| 组件 | 职责 |
|---|---|
| `CRTScene` | ★ R3F 场景：模型/灯光/相机自适应/射线热区/frameloop 门控/屏幕贴图 |
| `TurntableLab` | 独立实验页 `/turntable-lab` 的 3D 唱机，**不参与首页叙事** |

## 效果件

| 组件 | 职责 |
|---|---|
| `DecryptedText` | 乱码逐字解密（开场文案） |
| `FuzzyText` | 抖动故障字（仅故障闪现期间挂载） |
| `PixelTrail` | 像素鼠标痕迹（Manifesto 区） |
| `NoiseOverlay` | 全局颗粒 |
| `CustomCursor` | 桌面十字准星 |

## UI 件

| 组件 | 职责 |
|---|---|
| `FixedNavigation` | 固定导航：区块高亮 + 平滑跳转 + 顶部扫光过场 |
| `SoundControl` | 声音开关（默认静音） |
| `LocalClock` | 本地时钟 |
| `BackButton` | 文章页返回（有站内历史则 `router.back()`） |
| `ScrollTop` | 文章页挂载强制回顶（`useLayoutEffect`） |

---

★ = 跨模块契约，文件头有 L3 注释，改动需同步。
