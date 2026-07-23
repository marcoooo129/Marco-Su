# 生产流水线 · 分阶段闸门 Prompt（v2）

> 从本项目真实建站过程反推。**每一步是一道闸门**：单步内锁死 agent 自主半径，
> 交接点给人类一个可验证信号。
>
> 用法：填 §0 变量 → 从 S0 开始，一次只粘一步 → 过 Checklist → 才进下一步。
> 全局硬约束在根 `CLAUDE.md`，本文件不复述，只在每步顶部指明"先读 CLAUDE.md"。

---

## §0 变量表（新项目只改这里）

```yaml
NAME / NAME_LOCAL / INITIALS / ROLE
TAGLINE / POSITIONING / EMAIL / LOCATION
SOCIALS:      [Email, Instagram, GitHub]
ACCENT:       "#21a35c"          # 唯一彩色
FONT_DISPLAY: "Space Mono"
FONT_UI:      "IBM Plex Mono"
LIGHT_MODE:   "米白 #b9b9b5 系"   # 开灯
DARK_MODE:    "近黑 #060607 系"   # 关灯
HERO_MODEL:   "public/models/crt-tv.glb"
MODEL_BUDGET: "≤ 3MB"            # 硬预算，超了不许进仓库
CONTENT:      4 projects / 3 story / 4 notes / 2 education / 3 languages
REPO / HOST / DOMAIN
```

---

## §1 每步 Prompt 的统一骨架

粘贴任何一步时，**保留这个外壳**：

```
先读根 CLAUDE.md 与相关 L2 CLAUDE.md，遵守其中全部硬约束。
逐步引导我，每完成一个可验证的小步就停下来让我确认，不要一次做完整步。

【本步任务】
<粘贴 S_n 的任务段>

【完成后】
1. 逐条自查下方 Checklist，用给出的命令验证，贴出真实输出
2. 无法在当前环境验证的项，明确写"未验证 + 原因"，不要假装通过
3. 同步 L1/L2 文档（若组件或路由有增删）
4. STOP，等待我的下一条指令。不要自行开始下一步。
```

> 最后一条最关键：没有它，agent 会一路跑到底，人类失去所有检查点。

---

## S0 · Bootstrap（进新项目/新 session 第一件事）

```
【任务】
1. 扫描仓库根目录是否存在 CLAUDE.md、components/CLAUDE.md、app/CLAUDE.md
2. 缺哪层就补种哪层（模板见本项目同名文件）
3. 读完后向我复述：技术栈、目录结构、当前项目状态（greenfield / LIVE）
4. 若是 LIVE 项目，列出"禁止破坏"的清单（已上线 URL、已索引路径）
```
**Checklist**
- [ ] `ls CLAUDE.md components/CLAUDE.md app/CLAUDE.md` 三个都存在
- [ ] agent 能正确复述技术栈与项目状态

---

## S1 · 内容与数据契约

```
【任务】不写任何 UI。
1. 从我给的简历/旧站/材料中提取真实经历，交叉核对，标注"待确认 / 疑似模板占位"
2. 剔除：年龄、证件号、住址、政治面貌等不宜公开信息
3. 不为经历虚构量化结果（禁止"效率提升 30%"这类无据数字）
4. 产出 data/site.ts：类型化、`as const`，字段见 §0 CONTENT
5. 给 site.ts 写 L3 文件头契约（INPUT/OUTPUT/POS）
```
**Checklist**
- [ ] `npx tsc --noEmit` 无输出
- [ ] `grep -ri "lorem\|ipsum\|placeholder" data/` 为空
- [ ] 每条经历我本人确认属实

**Common Pitfalls**
| 坑 | 表现 | 解 |
|---|---|---|
| 旧站模板残留 | 出现你没做过的项目 | 与简历交叉核对，存疑项单列 |
| 头衔臆测 | 写成"HCI 硕士"但实为传播学 | 学历以官方培养计划为准 |

---

## S2 · 设计令牌 + 静态骨架

```
【任务】
1. 建 Next.js 15 + TS + Tailwind(仅工具类) + fontsource 字体
2. globals.css 定义两套主题令牌（清单见根 CLAUDE.md §4.1）+ z-index 令牌
   ⚠ 文字类令牌 --hair/--dim/--body 必须两套主题都定义
3. 给 globals.css 写 L3 文件头契约
4. 搭 8 幕静态骨架：真实文案、零动画
```
**Checklist**
```bash
npx tsc --noEmit                       # 无输出
# 白名单外无硬编码颜色（期望空输出）
grep -rn "#[0-9a-fA-F]\{3,8\}\b\|rgba\?(" components/ app/ --include="*.tsx" \
  | grep -vE "CRTScene|PixelTrail|GlitchTransition|FuzzyText|TurntableLab|opengraph-image|layout\.tsx"
```
浏览器 console（375 / 430 / 1440 三档各跑一次）：
```js
document.body.scrollWidth === document.documentElement.clientWidth   // true
```
- [ ] 切 `document.documentElement.dataset.theme` 后无隐形文字

**Common Pitfalls**
| 坑 | 表现 | 解 |
|---|---|---|
| 主题只换背景 | 关灯后黑底黑字 | 文字/发丝线也要令牌化 |
| 裸 `vw` 字号 | 375 正常、430 崩 | 一律 `clamp()` |

---

## S3 · 滚动引擎 + 开场闸门

```
【任务】
1. SmoothScrollProvider：Lenis + gsap.ticker + ScrollTrigger.update 同步，
   挂 window.__lenis，卸载 destroy + delete。写 L3 契约头。
2. IntroSequence：
   - 解密文字入场；reduced-motion 直接显示明文
   - 开场锁滚动（overflow:hidden + lenis.stop()）
   - 仅"向下滚 / 上划 / 方向键 / 点击"放行
   - 收起动画播完（~700ms）再解锁，丢弃切换瞬间惯性
   - sessionStorage 记忆；useLayoutEffect 在绘制前跳过，避免闪帧
   - ⚠ 抽出 unlock()，close 的每条分支（含 Skip 按钮）都调用
```
**Checklist**
```js
!!window.__lenis                                  // true
document.documentElement.style.overflow           // 开场结束后为 ""
```
- [ ] 刷新页面不重播开场
- [ ] 点 Skip 后**页面能正常滚动**（此处曾出事故）

**Common Pitfalls**
| 坑 | 表现 | 解 |
|---|---|---|
| 漏解锁分支 | 点 Skip 后整页卡死不能滚 | `unlock()` 抽出，每条路径调用 |
| 用 useEffect 判跳过 | 开场闪一帧才消失 | 改 `useLayoutEffect` |

---

## S4 · 3D 主角（最高风险，独立成步）

```
【任务】
A. 模型预处理（先做，不达标不许进仓库）
   1. 解析 GLB：节点/网格/材质/贴图分辨率与体积
   2. 4K PNG 贴图 → 降分辨率 + 转 JPEG（scripts/optimize-glb.js）
   3. 硬预算 MODEL_BUDGET
B. 场景
   1. <Canvas alpha> 透明，背景交给 CSS（"关灯"才能让墙变黑）
   2. 相机 z 随视口宽高比自适应（竖屏拉远防裁切）
   3. 屏幕内容用 CanvasTexture 贴片；位置用场景内射线探针实测标定，禁止目测
C. 交互
   1. 鼠标视角跟随（阻尼）
   2. 设"禁区"：指针进入模型范围时目标角度**归零并停住**（不是冻结当前角度）
   3. 滚动推进：缩放绕屏幕中心；前 ~22% 设 DEAD_ZONE 吸收上屏惯性
D. 点击热区
   1. 必须 3D 射线拾取（opacity:0 的 mesh + onClick）
   2. <Html> 装饰层整棵子树 pointer-events:none
   3. 另配 sr-only 真按钮供键盘/读屏
E. 性能：frameloop 由 IntersectionObserver 门控（离屏 "never"）
F. 写 CRTScene 的 L3 契约头
```
**Checklist**
```bash
ls -la public/models/*.glb        # 体积 ≤ MODEL_BUDGET
```
```js
// 热区是否被装饰层挡住：应返回 CANVAS，不能是 path/svg/div
const [x,y] = JSON.parse(window.__crtState()).knobScreen;
document.elementFromPoint(x,y).tagName
```
- [ ] 点模型上的按钮**必中**；点旁边空白**不触发**
- [ ] 滚过 3D 区后，GPU 占用回落（frameloop 已暂停）
- [ ] 竖屏 430px 模型不被左右裁切

**Common Pitfalls**（本步是事故重灾区）
| 坑 | 表现 | 解 |
|---|---|---|
| DOM 按钮当 3D 热区 | 点按钮没反应，点旁边空白反而灵 | 射线拾取 |
| 装饰 SVG 盖住热区 | 同上 | 装饰层 `pointer-events:none` |
| `getBoundingClientRect` 测 Html transform | 返回 [0,0] 或未变换盒子 | 用 `camera.project()` |
| "跟随鼠标 + 可点击"自激 | 靠近按钮时抖动、点不中 | 禁区内**回正并停住** |
| frameloop 默认 always | 离屏仍满帧、整机发烫 | IntersectionObserver 门控 |
| 贴图统治体积 | 35MB 里 37MB 是 3 张 4K PNG | 降分辨率 + 转 JPEG |

---

## S5 · 转场与叙事段落

```
【任务】
1. GlitchTransition：一次性闪现（<1s，低分辨率 canvas + image-rendering:pixelated），
   闪白时程序化跳到下一段，随后淡出。禁止做成长时间遮罩。
2. ManifestoSection：
   - 固定文案入场后不动；只有末尾动态词做打字机（删除→输入循环）
   - 隐藏占位层锁死标题高度，避免换词时下方内容跳动
   - ⚠ 标题 grid 必须 minmax(0,1fr)，否则占位层里的 nowrap 长词撑破列被裁
3. TypeTransition：整句只横穿一次，禁止跑马灯循环（重复疲劳）
4. PixelTrail：网格对齐 + 透明度分档量化（跳变而非平滑淡出）
```
**Checklist**
```js
// 375 与 430 两档各跑
const t = document.querySelector('.manifesto-title');
t.scrollWidth <= t.clientWidth + 1                      // true = 不截断
document.body.scrollWidth === document.documentElement.clientWidth  // true
```
- [ ] 故障闪现 <1s 且自动落位到下一幕
- [ ] 同一句话不会滚第二遍

---

## S6 · 内容区 + 子页路由

```
【任务】
1. AboutSection：编辑式编号清单（大号强调色序号 + 标题 + 元信息 + 正文 + 发丝线）。
   不要深色图形盒子撞浅色背景。
2. Notes 列表：整行可点，hover 标题变强调色
3. app/notes/[slug]/page.tsx：generateStaticParams 静态生成
   ⚠ Next 15 的 params 是 Promise → page 与 generateMetadata 都要 async + await params
4. BackButton：有站内历史 router.back()，否则回首页锚点
5. ScrollTop：文章挂载时 useLayoutEffect 强制 window.scrollTo(0,0)
6. 同步 app/CLAUDE.md 路由表
```
**Checklist**
```bash
npm run build 2>&1 | grep -A5 "Route (app)"    # 每篇 notes 都列为 SSG
rm -rf .next                                    # ⚠ build 后必清，否则 dev 崩
```
- [ ] 点开文章从**顶部**开始阅读（不是停在文末）
- [ ] 从文章返回首页**不重播开场**

**Common Pitfalls**
| 坑 | 表现 | 解 |
|---|---|---|
| Next 15 params 同步用 | build 报 PageProps 类型不满足 | `async` + `await params` |
| Lenis 遗留滚动位置 | 文章一进来停在文末 | 挂载强制 `scrollTo(0,0)` |
| 开场随路由重挂重播 | 返回首页又从头播 | sessionStorage 记忆 |

---

## S7 · 导航与全局交互

```
【任务】
1. 固定导航：当前区块高亮（滚动探测 + rAF 节流）+ 序号滑入 + 前导横线
2. 点击导航：window.__lenis.scrollTo（~1.15s easeOutCubic），禁止瞬跳
3. 顶部强调色细线扫过作为"跳转中"过场
   ⚠ 扫光条必须放在导航之外，否则被 mix-blend-mode 反色
4. 自定义十字准星光标（桌面）、Sound 开关（默认静音）
```
**Checklist**
- [ ] 滚到各幕，导航对应项高亮切换正确
- [ ] 点导航是平滑滑动，不是瞬间跳变

---

## S8 · 移动端适配（独立成步，不可与桌面合并）

```
【任务】在 375px 与 430px 两档分别验证（必须两档）：
1. 所有 vw 字号加 clamp 上限
2. 区块顶部 padding 加 env(safe-area-inset-top)，避开刘海屏固定导航
3. Hero 底部：隐藏冗长定位语，只留地点 + 时钟，左右分列不重叠
4. 3D 手机同样启用（只对 reduced-motion 降级），相机按宽高比拉远
5. 多列卡片（社交等）在窄屏改单列整行，账号不得截断
```
**Checklist**
```js
document.body.scrollWidth === document.documentElement.clientWidth   // 两档都 true
// 文字是否被截断
[...document.querySelectorAll('h1,h2,h3')].every(e => e.scrollWidth <= e.clientWidth + 1)
```
- [ ] 375 与 430 两档**逐屏截图**比对，无截断/遮挡/溢出

**Common Pitfalls**
| 坑 | 表现 | 解 |
|---|---|---|
| 只测 375 | 430 大屏手机排版崩 | **两档都测**（本项目栽过） |
| 固定导航压内容 | 顶栏文字与导航重叠 | `env(safe-area-inset-top)` |

---

## S9 · 性能与可访问性

```
【任务】
1. 3D frameloop 离屏暂停（S4 若未做此处补）
2. 移除所有 console.log 与调试代码路径
3. 降级分支的 setInterval 不应在主分支运行（无效计时器门控）
4. 图片 next/image + 明确尺寸
5. a11y：原生 button、aria-label、focus-ring、skip-link、sr-only 备用控件
6. 完整 prefers-reduced-motion 路径
```
**Checklist**
```bash
grep -rn "console\.\(log\|debug\|info\)" components/ app/    # 期望空
```
- [ ] Lighthouse 移动端 Performance ≥ 80 / A11y ≥ 95
- [ ] 开启系统"减少动效"后无强制动画

---

## S10 · 上线

```
【任务】
1. .gitignore 排除：node_modules .next out dist .env* .vercel .claude
   以及私人工作记录（对话日志、简历原件）
2. git 提交推送
3. Vercel 部署
   ⚠ 若该仓库曾是别的框架（Vite 等），必须先写 vercel.json {"framework":"nextjs"}
     否则报 No Output Directory named "dist"
4. 自定义域名（可选）：A @ → 76.76.21.21 / CNAME www → cname.vercel-dns.com
   国内注册商的 .cc/.cn 需先实名认证否则不解析；境外托管不需要 ICP 备案
```
**Checklist**
```bash
git status --short | grep -iE "\.env|\.vercel|node_modules"   # 期望空
curl -s -o /dev/null -w "%{http_code}\n" https://<域名>/
curl -s -o /dev/null -w "%{http_code}\n" https://<域名>/notes/<任一slug>
```
- [ ] 首页 / 文章页 / 静态资源均 200
- [ ] 仓库里无任何密钥

**Common Pitfalls**
| 坑 | 表现 | 解 |
|---|---|---|
| dev 运行时跑 build | `Cannot find module './xxx.js'` | build 后 `rm -rf .next` 重启 dev |
| Vercel 沿用旧框架预设 | `No Output Directory named "dist"` | `vercel.json` 固定 nextjs |
| 域名未实名 | DNS `NXDOMAIN`，域名打不开 | 先实名再配解析；这不是部署失败 |

---

## §2 验证方法论（本项目实测教训）

**当动画无法在当前环境观察时，不要假装验证过。** 本项目的预览面板会冻结
`requestAnimationFrame`（表现为截图全黑、`innerHeight === 0`、动画不动）。
替代手段，按可信度排序：

1. **DOM 测量**：`getBoundingClientRect` / `getComputedStyle` / `scrollWidth`
2. **状态探针**：往 `window` 挂调试函数（如 `window.__crtState()`）读真实运行值
3. **服务端校验**：`curl` + `grep` 验证 SSR 输出与静态资源
4. **构建校验**：`tsc --noEmit` + `next build` 的路由表

以上都做不到的，**如实告知"未验证"并说明原因**，交由人在真实浏览器确认。

---

## §3 这套东西的真正价值

不在 prompt 文本，而在**把重复的规范固化成了文件**：

- `CLAUDE.md`（L1）→ 约束前置，砍掉 AI 的可选空间，比事后 review 便宜一个数量级
- `*/CLAUDE.md`（L2）→ 跨 session 冷启动能重建心智模型
- L3 文件头 → **只给 4 个跨模块契约文件**。其余从 import/export 自读，
  手工维护必然 drift，drift 后文档反成误导源
- 每步 `STOP，等待下一条指令` → 锁死单步自主半径，交接点有可验证信号

新项目跑完，把新踩的坑追加进对应步的 Common Pitfalls —— 这套东西越用越硬。
