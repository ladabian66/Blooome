# Blooome

我的个人作品集网站 | My personal portfolio website

数字媒体艺术 × AI Coding

**线上地址：https://ladabian66.github.io/Blooome/**

---

## 这个仓库是什么

一个用 React + Vite + Tailwind CSS 搭建的单页作品集网站。
源代码在 `main` 分支；线上看到的网页由 GitHub 自动从 `main` 构建并发布到 `gh-pages` 分支（`gh-pages` 是自动生成的，**不要手动改它**）。

## 本地预览（在自己电脑上改和看）

```bash
npm install     # 第一次用，安装依赖（只需一次）
npm run dev     # 启动本地预览，按提示的地址在浏览器打开
```

改代码时浏览器会自动刷新，所见即所得。改完按 `Ctrl + C` 停止。

## 更新上线的流程（重点）

只需要三步，**全程不用手动碰 gh-pages，也不用在 GitHub 设置里点任何东西**：

```bash
git add .
git commit -m "说说这次改了什么"
git push
```

推送到 `main` 后，GitHub Actions 会自动构建并发布，大约 1~3 分钟后线上更新。

查看自动构建进度：仓库页面 → 顶部 **Actions** 标签 → 最新一条运行记录。

## 更新了但网站没变？按顺序排查

1. **先看 Actions**：仓库 → Actions，最新一条是不是绿色✓。红色✗说明构建失败，点进去能看到原因。
2. **强制刷新浏览器**：网站页面按 `Ctrl + F5`。浏览器会缓存旧网页，普通刷新可能看不到更新。
3. **还没变就"踢一脚"**：仓库 → Settings → Pages → Branch 改成 **None** 保存，再改回 **gh-pages** 保存，等 1~2 分钟再 Ctrl+F5。（Pages 的自动构建偶尔会漏掉提交，重选一次来源会强制它重新构建。）

## 技术栈

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui + skiper-ui 组件
- Framer Motion 动效
- 部署：GitHub Actions → GitHub Pages
