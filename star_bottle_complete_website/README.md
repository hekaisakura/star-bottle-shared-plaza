# 星座漂流瓶完整网站

这是一个完整的 Node.js + HTML5 Canvas 网站项目。

## 功能

- 首页暗黑宇宙视觉
- 12 星座轮盘
- 16 MBTI 轮盘
- 情绪信号输入
- 暗夜动物画像生成
- 情绪转述摘要
- 共享海滩广场
- 所有人访问同一个网址时，能看到同一个海滩广场
- 每只瓶子最多被打开 10 次

## 本地运行

```cmd
npm install
npm start
```

浏览器打开：

```text
http://localhost:3000
```

## 上传 GitHub

把本文件夹里的所有内容上传到 GitHub：

```text
index.html
server.js
package.json
data/
render.yaml
README.md
.gitignore
```

## Render 部署

Render 创建 Web Service：

```text
Build Command: npm install
Start Command: npm start
```

如果使用本项目根目录部署，不需要填 Root Directory。

## 说明

当前版本用 `data/bottles.json` 保存瓶子数据，适合比赛演示和短期测试。真正长期上线建议换成数据库，例如 Supabase、MongoDB 或 PostgreSQL。
