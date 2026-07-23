# app/ — L2 路由契约

> 新增/删除路由时**必须**同步本文件。

## 路由表

| 路径 | 文件 | 渲染 | 说明 |
|---|---|---|---|
| `/` | `page.tsx` | 静态 | 首页，装配 `PortfolioExperience` |
| `/notes/[slug]` | `notes/[slug]/page.tsx` | SSG | 博客详情，`generateStaticParams` 由 `site.writing` 生成 |
| `/turntable-lab` | `turntable-lab/page.tsx` | 静态 | 3D 唱机实验页，独立于首页叙事 |

## 全局文件

| 文件 | 职责 |
|---|---|
| `layout.tsx` | 根布局、metadata、字体注入、`viewport.themeColor` |
| `globals.css` | ★ 全站唯一设计令牌源（两套主题变量 + 所有区块样式） |
| `opengraph-image.tsx` | OG 卡片，Satori 构建期渲染 |
| `icon.svg` | favicon |

## 约束

- **Next 15 的 `params` 是 Promise**：`page` 与 `generateMetadata` 都必须
  `async` + `await params`，否则 `next build` 报 PageProps 类型错误。
- 已上线的 URL（`/notes/<slug>`）不要随意改名，见根 `CLAUDE.md` §6。
- 新增动态路由必须提供 `generateStaticParams`，保持全站可静态导出。

★ = 跨模块契约，文件头有 L3 注释。
