# 电影化个人站 · 工业化生产流水线（Prompt Pipeline v1.0）

> 从 `Marco Su` 作品集（Next.js 15 + R3F + GSAP，已上线 marco-su.vercel.app）的完整建站过程反推整理。
> 目标：把"一次性手工创作"变成**可重复、可验收、可交付**的流水线。
> 用法：填好 §1 变量表 → 按 §3 逐阶段投喂 Prompt → 每阶段过 §5 验收门 → §6 上线。

---

## 1. 变量表（每个新项目只改这里）

```yaml
# ---- 身份 ----
NAME:            "Marco Su"
NAME_LOCAL:      "苏传毫"
INITIALS:        "MS"                      # 导航角标
ROLE:            "Independent Product Maker / Vibe Coder"
TAGLINE:         "Not trained as a programmer. Serious about building products."
POSITIONING:     "From logistics and communication to AI-native products—turning curiosity into things people can open and use."
EMAIL:           "marco.su@edu.unifi.it"
LOCATION:        "Florence, Italy"
SOCIALS:         [{label: Email}, {label: Instagram}, {label: GitHub}]

# ---- 视觉 ----
ACCENT:          "#21a35c"                 # 强调色（唯一彩色）
FONT_DISPLAY:    "Space Mono"              # 大标题
FONT_UI:         "IBM Plex Mono"           # 正文/UI
MOOD:            "复古终端 + 实验编辑排版 + 独立电影片头"
LIGHT_MODE:      "米白 #b9b9b5 系"          # 开灯
DARK_MODE:       "近黑 #060607 系"          # 关灯

# ---- 内容 ----
PROJECTS:        4 个（title/number/year/category/description/status/cover/slug/externalUrl）
STORY:           3 段经历（index/title/meta/short/body）
WRITING:         4 篇 Notes（index/slug/title/date/tag/readingTime/excerpt/body[]）
EDUCATION:       2 条
LANGUAGES:       3 条

# ---- 资产 ----
HERO_MODEL:      "public/models/crt-tv.glb"  # 主角 3D 模型
MODEL_BUDGET:    "≤ 3MB"                     # 硬预算

# ---- 交付 ----
REPO:            "github.com/<user>/<repo>"
HOST:            "Vercel"
DOMAIN:          "<optional>"
```

---

## 2. 总纲 Prompt（一次性总览，给 AI 建立全局认知）

```
你是一名资深 Creative Developer，擅长交互设计、Web 动画与 3D。
为我构建一个「电影化滚动叙事」个人作品集网站。

【技术栈 · 强制】
- Next.js 15 App Router + TypeScript（严格模式）
- 手写 CSS + CSS 自定义属性做主题（Tailwind 仅用于 reset/sr-only 等工具类）
- GSAP + ScrollTrigger 统一管理所有滚动动画（不得引入第二套动画框架）
- Lenis 平滑滚动，通过 gsap.ticker 驱动，全局挂 window.__lenis
- three.js + @react-three/fiber + @react-three/drei 承载 3D 主角
- 字体用 @fontsource 本地化，不走 CDN

【叙事结构 · 8 幕，顺序固定】
01 IntroSequence   开场解密文字 + "滚动进入"闸门
02 HeroTerminal    3D 主角（CRT 电视）+ 鼠标视角跟随 + 滚动推进镜头
03 GlitchTransition 一次性故障闪现转场（不是长时间遮罩）
04 ManifestoSection 巨型标题 + 打字机动态词 + SVG 路径绘制 + 像素鼠标痕迹
05 ProjectsRail    桌面端 pin + 横向轨道；移动端纵向卡片
06 TypeTransition  单次横穿巨字（禁止跑马灯循环）
07 AboutSection    编辑式编号清单 + Notes/博客列表
08 ContactSection  CTA + 社交卡片 + 页脚

【全局约束】
- 所有动画只用 transform / opacity；禁止动画 width/height/top/left
- 所有交互提供 prefers-reduced-motion 降级路径
- 所有排版尺寸用 clamp(min, vw, max)，禁止裸 vw（见 §4 陷阱 4）
- 深浅主题所有颜色走 CSS 变量，禁止硬编码文字色（见 §4 陷阱 13）
- 数据全部集中在 data/site.ts，组件不写死文案

【交付要求】
每阶段结束必须：typecheck 通过 + 生产构建通过 + 过该阶段验收门（§5）。
不要只给方案，直接产出可运行代码。
```

---

## 3. 分阶段 Prompt（流水线主体）

### P0 · 内容与资料整理

```
不要写任何 UI 代码。先只做内容。
1. 从我提供的简历/旧站/材料中提取真实经历，交叉核对，标注"待确认/疑似模板占位"。
2. 输出两份：
   - 个人资料底稿（全部事实 + 疑点 + 隐私边界）
   - 对外文案稿（一句话定位 / 简介 / 3 段经历 / 项目卡片文案）
3. 剔除：年龄、证件号、住址、政治面貌等不适合公开的信息。
4. 不得为经历虚构量化结果（如"效率提升 30%"）。
产出落到 data/site.ts 的类型化结构，字段见变量表。
```
**验收**：`site.ts` 可编译；无 Lorem Ipsum；无未经核实的头衔。

---

### P1 · 设计系统与骨架

```
建立项目骨架与设计系统：
1. Next.js 15 + TS + Tailwind(仅工具类) + fontsource 字体
2. globals.css 定义两套主题变量（默认=开灯米白，[data-theme="light"]=关灯近黑）：
   --page --ink --muted --line --grid --accent
   --hero --hero-ink --hero-dim --paper --paper-ink
   --hair --dim --body            # 注意：这三个是 §4 陷阱 13 的解药
   以及 z-index 层级令牌 --z-base/content/overlay/nav/cursor/intro
3. 搭 8 个 section 的静态骨架（真实文案、无动画），确保：
   - 移动端无横向溢出
   - 深浅主题切换后所有文字仍可读
产出：可滚动的静态站。
```
**验收**：`document.body.scrollWidth === clientWidth`（375 / 430 / 1440 三档);切主题无隐形文字。

---

### P2 · 滚动引擎与开场

```
1. SmoothScrollProvider：Lenis + gsap.ticker 驱动 + ScrollTrigger.update 同步，
   实例挂 window.__lenis，卸载时 destroy 并 delete。
2. IntroSequence：
   - 文案用"解密"效果（乱码逐字解出），reduced-motion 直接显示明文
   - 开场期间锁滚动（documentElement.overflow=hidden + lenis.stop()）
   - 仅当用户"向下滚动/触屏上划/方向键/点击"才放行
   - 收起动画播完（~700ms）再解锁，丢弃切换瞬间的滚轮惯性
   - sessionStorage 记忆：本会话已看过则跳过（useLayoutEffect 在绘制前隐藏，避免闪帧）
   - 任何关闭路径（含 Skip 按钮）都必须解锁滚动
```
**验收**：刷新不重播;从子页返回不重播;点 Skip 后页面可滚动(见 §4 陷阱 11)。

---

### P3 · 3D 主角（最高风险阶段）

```
把 <HERO_MODEL> 接入 Hero：

【模型预处理 · 先做】
- 解析 GLB：节点/网格/材质/贴图分辨率与体积
- 贴图 4K PNG → 按需降分辨率并转 JPEG（scripts/optimize-glb.js）
- 硬预算：整包 ≤ MODEL_BUDGET；超了不许进仓库

【场景】
- <Canvas alpha 透明>，背景交给 CSS（这样"关灯"能让墙变黑）
- 相机随视口比例自适应：竖屏拉远，保证模型不被左右裁切
- 灯光：主光 + 侧补光 + 背光 + 一盏强调色点光
- 屏幕内容用 CanvasTexture 贴片（若模型屏幕是烘焙在贴图里）
  贴片位置用"场景内射线探针"实测标定，不要目测

【交互】
- 鼠标视角跟随：阻尼 lookAt（gsap.quickTo 或手写 ease）
- 设"禁区"：指针进入模型范围时目标角度归零并停住（见 §4 陷阱 12）
- 滚动推进：缩放绕"屏幕中心"发生（内层 group 把屏幕中心移到原点），
  构图偏移随进度收敛到 0，镜头始终锁屏幕
- 停留区 DEAD_ZONE：前 ~22% 滚动不推进，吸收上一屏带来的惯性

【点击热区 · 关键】
- 用 3D 射线拾取（一个 opacity:0 的 mesh + onClick），
  绝不用 CSS 3D 变换过的 DOM 按钮（见 §4 陷阱 1）
- 装饰性标注（引线/文字）整棵子树 pointer-events:none
- 另配一个 sr-only 真按钮，保证键盘与读屏可用

【性能】
- frameloop 由 IntersectionObserver 门控：模型离屏 → "never"，回来 → "always"
```
**验收**：包体达标;点模型上的按钮必中、点旁边空白不触发;离屏后 GPU 占用归零;竖屏不裁切。

---

### P4 · 转场与叙事段落

```
1. GlitchTransition：一次性闪现（噪点 canvas ~0.8s），
   闪到最白时程序化跳到下一段，随后淡出。禁止做成长时间遮罩。
   用 1/4 分辨率 canvas + image-rendering:pixelated 控成本。
2. ManifestoSection：
   - 固定文案入场后不再动；只有末尾"动态词"做打字机（删除→输入循环）
   - 用隐藏占位层锁死标题高度，避免换词时下方内容跳动
   - ⚠ 占位层里的 nowrap 长词会撑破 grid 列 → 必须 grid-template-columns: minmax(0,1fr)
   - 像素鼠标痕迹：canvas 网格对齐、透明度分档量化（跳变而非平滑淡出）
3. TypeTransition：整句只横穿一次，起点在右缘外、终点句尾出左缘。
   禁止跑马灯循环（会造成重复疲劳）。
```
**验收**：Manifesto 在 375/430 两档都不截断;转场闪现 <1s 且自动落位。

---

### P5 · 内容区与子页

```
1. AboutSection：编辑式编号清单（大号强调色序号 + 标题 + 元信息 + 正文 + 发丝线），
   不要深色图形盒子撞浅色背景。
2. Notes/博客：
   - 列表整行可点，hover 标题变强调色
   - 详情页 app/notes/[slug]/page.tsx：generateStaticParams 静态生成
   - ⚠ Next 15 的 params 是 Promise，page 与 generateMetadata 都要 async + await
   - 详情页顶部"← Back"（有站内历史则 router.back()，否则回首页锚点）
   - ⚠ 挂载时 useLayoutEffect 强制 window.scrollTo(0,0)（见 §4 陷阱 10）
   - 底部"更多文章"互链
3. ContactSection：CTA + 社交卡片（桌面多列 / 手机单列整行，账号不得截断）+ 页脚
```
**验收**：文章页从顶部开始阅读;返回不重播开场;社交账号完整显示。

---

### P6 · 导航与全局交互

```
1. 固定导航：当前区块高亮（滚动探测，rAF 节流）+ 序号滑入 + 前导横线
2. 点击导航：lenis.scrollTo 平滑滚动（~1.15s, easeOutCubic）
   + 顶部强调色细线扫过作为"跳转中"过场
   ⚠ 扫光条要放在导航之外，避免被 mix-blend-mode 反色
3. 自定义十字准星光标（桌面）、Sound 开关（默认静音）
```
**验收**：三个区块高亮切换正确;点击平滑滚动而非瞬跳。

---

### P7 · 移动端适配（独立阶段，不可与桌面合并做）

```
在 375px 与 430px 两档分别验证（必须两档！见 §4 陷阱 4）：
1. 排版：所有 vw 字号加 clamp 上限
2. 固定导航与内容的重叠：区块顶部 padding 加 env(safe-area-inset-top)
3. Hero 底部信息：隐藏冗长定位语，只留地点 + 时钟，左右分列不重叠
4. 3D：手机同样启用（只对 reduced-motion 降级），相机按宽高比拉远
5. 横向溢出为零：body.scrollWidth === documentElement.clientWidth
```
**验收**：两档宽度全屏截图逐屏比对,无截断/遮挡/溢出。

---

### P8 · 性能与可访问性

```
1. 3D frameloop 离屏暂停（若 P3 未做，此处补）
2. 移除所有 console.log 与调试代码路径
3. 无效计时器门控（降级分支的 setInterval 不应在 3D 分支运行）
4. 图片 next/image + 明确尺寸；模型/大图懒加载
5. a11y：原生 button、aria-label、focus-ring、skip-link、sr-only 备用控件
6. 完整 prefers-reduced-motion 路径
```
**验收**：Lighthouse 移动端 Performance ≥ 80、A11y ≥ 95;滚动无明显掉帧。

---

### P9 · 上线

```
1. .gitignore 排除：node_modules .next out dist .env* .vercel
   以及私人工作记录（如 docs/chat-logs）
2. git 提交推送
3. Vercel：
   - ⚠ 若该仓库曾是别的框架（Vite 等），必须 vercel.json 固定 {"framework":"nextjs"}
     否则会报 "No Output Directory named dist"（见 §4 陷阱 8）
   - vercel --prod
4. 自定义域名（可选）：
   - A  @    76.76.21.21
   - CNAME www  cname.vercel-dns.com
   - 国内注册商的 .cc/.cn 等需先完成实名认证，否则不解析
   - 境外托管（Vercel）不需要 ICP 备案
```
**验收**：线上首页/文章页/静态资源均 200;自定义域名 HTTPS 就绪。

---

## 4. 陷阱清单（本项目真实踩坑，直接写进 Prompt 当硬约束）

| # | 陷阱 | 症状 | 解药 |
|---|---|---|---|
| 1 | **CSS 3D 变换的 DOM 覆盖层吃点击** | 点按钮没反应，点旁边空白反而生效 | 3D 热区用 R3F 射线拾取；装饰层 `pointer-events:none` |
| 2 | `getBoundingClientRect` 在 `<Html transform>` 内不可信 | 返回未变换的原始盒子 / [0,0] | 用相机 `.project()` 投影算屏幕坐标 |
| 3 | 隐藏占位层里的 `nowrap` 长词撑破 grid 列 | 整段文字按超宽列排版并被 `overflow:hidden` 裁掉 | `grid-template-columns: minmax(0,1fr)` + 窄屏放开 nowrap |
| 4 | **裸 `vw` 字号在大屏手机反而更大** | 375px 正常、430px 巨大且换行崩坏 | 一律 `clamp(min, vw, max)`；**两档宽度都要测** |
| 5 | R3F 默认 `frameloop="always"` | 离屏仍满帧渲染，整站发烫掉帧 | IntersectionObserver 门控 `always/never` |
| 6 | Next 15 `params` 是 Promise | `next build` 报 PageProps 类型不满足 | page/generateMetadata 改 `async` + `await params` |
| 7 | dev 运行时跑 `next build` | `Cannot find module './xxx.js'` | build 后必须 `rm -rf .next` 并重启 dev |
| 8 | Vercel 沿用旧框架预设 | `No Output Directory named "dist"` | `vercel.json` 固定 `{"framework":"nextjs"}` |
| 9 | 开场动画随路由重挂而重播 | 从文章页返回又从头播一遍 | sessionStorage 记忆 + `useLayoutEffect` 绘制前跳过 |
| 10 | Lenis 遗留滚动位置带进新路由 | 打开文章直接停在文末 | 文章挂载 `useLayoutEffect` 强制 `scrollTo(0,0)` |
| 11 | 滚动锁未在所有关闭路径解锁 | 点 Skip 后整页无法滚动 | 抽出 `unlock()`，close 的每条分支都调用 |
| 12 | "跟随鼠标 + 可点击"的元素自激振荡 | 靠近按钮时元素抖动、点不中 | 设禁区：指针进入范围就**回正并停住**（不是冻结当前角度） |
| 13 | 主题切换只换背景不换文字色 | 关灯后出现黑底黑字 | 文字/发丝线/正文色全部走 `--hair/--dim/--body` 主题变量 |
| 14 | `overflow:hidden` 裁掉字母下降部 | `g/p/y` 少一截 | 遮罩只在入场动画期间施加，`onComplete` 撤掉 |
| 15 | 刘海屏固定导航压住内容 | 顶栏文字与导航重叠 | 区块 padding 加 `env(safe-area-inset-top)` |
| 16 | GLB 体积被贴图统治 | 35MB 里 37MB 是 3 张 4K PNG | 降分辨率 + 转 JPEG，压到 ~2.6MB |
| 17 | 跑马灯循环造成重复疲劳 | 同一句话滚两遍看着累 | 改单次横穿，读完即走 |
| 18 | 预览面板 rAF 冻结 | 截图全黑/动画不动/`innerHeight=0` | 改用 DOM 测量与 `fetch` 校验；动画去真实浏览器验 |

---

## 5. 验收门（每阶段必过，可直接作为 Prompt 结尾）

```
完成后请自检并报告：
□ npx tsc --noEmit 通过
□ next build 通过（构建后清 .next 再重启 dev）
□ 375px / 430px / 1440px 三档无横向溢出
□ 深/浅主题切换后无隐形文字
□ 所有可点元素：点中生效、点旁边不生效
□ prefers-reduced-motion 下无强制动画
□ 无 console.log 残留
□ 首屏关键资产体积在预算内
若某项无法在当前环境验证，明确说明"未验证"及原因，不要假装通过。
```

---

## 6. 组件目录（可直接复用的积木）

| 组件 | 职责 | 复用要点 |
|---|---|---|
| `SmoothScrollProvider` | Lenis + gsap.ticker | 挂 `window.__lenis` 供全局调度 |
| `IntroSequence` | 解密开场 + 滚动闸门 | sessionStorage 一次性 |
| `DecryptedText` | 乱码逐字解密 | `animateOn="view"` 初始即乱码，避免闪明文 |
| `CRTScene` | R3F 3D 主角 | 相机自适应 / frameloop 门控 / 射线热区 |
| `GlitchTransition` | 一次性故障闪现 | 低分辨率 canvas + 自动跳转 |
| `FuzzyText` | 抖动故障字 | 只在闪现期间挂载 |
| `ManifestoSection` | 巨型标题 + 打字机词 | 隐藏占位层锁高度 |
| `PixelTrail` | 像素鼠标痕迹 | 网格对齐 + 透明度分档 |
| `ProjectsRail` | pin 横向轨道 | 距离按 `scrollWidth` 实算 |
| `TypeTransition` | 单次横穿巨字 | `invalidateOnRefresh` |
| `AboutSection` | 编辑清单 + Notes | 全走主题变量 |
| `BackButton` / `ScrollTop` | 子页导航 | 历史判断 + 强制回顶 |
| `FixedNavigation` | 区块高亮 + 平滑跳转 | 扫光条置于混合层之外 |

---

## 7. 一键复刻 Prompt（把上面全部压缩成一条）

```
按《电影化个人站生产流水线 v1.0》为我建站。
变量表见附件（§1）。严格遵循：
- 8 幕叙事结构与技术栈约束（§2）
- P0→P9 分阶段推进，每阶段过验收门（§5）后再进入下一阶段
- §4 的 18 条陷阱作为硬约束，不得触犯
- 3D 热区必须射线拾取；排版必须 clamp；主题必须走变量；
  移动端必须 375 与 430 两档验证
每阶段结束输出：改动文件列表 + 自检结果 + 未验证项说明。
```

---

*本文件由 Marco Su 作品集项目的真实建站过程反推整理，v1.0。*
*每次新项目跑完，把新踩的坑追加进 §4，流水线会越用越硬。*
