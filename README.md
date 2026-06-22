# kieranSpace

基于 Next.js 的个人博客 & 知识教程站点。

## 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 前端框架 | [Next.js](https://nextjs.org/) | App Router，静态站点生成（SSG） |
| 样式 | [Tailwind CSS](https://tailwindcss.com/) | 原子化 CSS |
| UI 组件 | [shadcn/ui](https://ui.shadcn.com/) | 可定制组件库，无包体积负担 |
| 内容 | MDX | 文章以 .mdx 文件形式存储在仓库 `content/` 目录 |
| 图床 | `public/images/` → [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)（后期） | 短期用本地目录，后期迁至 R2 |
| 部署 | [Vercel](https://vercel.com/) | 自动部署，与 Next.js 深度集成 |

## 架构特点

- **无后端服务器**：纯静态站点，构建时读取 MDX 文件生成 HTML
- **Git 驱动发布**：文章即代码，push 到 main 分支自动触发 Vercel 部署
- **不需要数据库**：无评论、登录等动态功能，架构极简

## 本地运行

```bash
npm install
npm run dev
```

## 图片方案

**短期**：图片放在 `public/images/` 目录，MDX 中用标准 Markdown 引用：

```md
![图片描述](/images/filename.png)
```

**后期**：图片数量增多后切换至 [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)，零出站流量费，S3 兼容 API。届时仅需将图片路径改为 R2 公开 URL 即可，MDX 写法不变。

## 部署

通过 [Vercel](https://vercel.com/) 部署，使用 GitHub 账号登录后导入仓库即可，Vercel 自动识别 Next.js 项目，无需额外配置。

线上地址：[kieran-space.vercel.app](https://kieran-space.vercel.app/)

每次 push 到 `main` 分支，Vercel 自动触发重新部署。

## 发布流程

1. 在 `content/` 目录下编写 `.mdx` 文章
2. `git add . && git commit && git push`
3. Vercel 自动构建部署

## 文章规范

文章使用 MDX 格式，前置元数据（frontmatter）示例：

```yaml
---
title: "文章标题"
slug: english-slug        # URL 路径，须为 ASCII 字符
description: "文章简述"
date: "2026-06-22"
tags: [tag1, tag2]
---
```

> **注意**：`slug` 为 URL 路由路径，**必须使用英文字符**（中文 slug 会导致 404）。英文文件名会自动作为 slug，中文文件名则需手动指定。
