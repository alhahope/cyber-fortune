# 天机接口 · TIANJI ORACLE

一个完全静态的赛博求签网页：选择问事方向，抽取当日固定签文，并可保存分享签卡。历史记录仅保存在当前浏览器。

## 本地运行

需要 Node.js 22 或更高版本。

```bash
npm install
npm run dev
```

访问终端显示的本地地址即可。

## 部署到 GitHub Pages

1. 在 GitHub 新建一个空仓库。
2. 将本项目提交并推送到仓库的 `main` 分支。
3. 进入仓库 **Settings → Pages**，将 **Source** 设为 **GitHub Actions**。
4. 等待 `Deploy to GitHub Pages` 工作流完成。

工作流会自动识别仓库名并配置子路径，因此普通项目仓库和 `用户名.github.io` 仓库都可以直接部署。

## 构建静态文件

```bash
npm run build:pages
```

生成结果位于 `out/`。
