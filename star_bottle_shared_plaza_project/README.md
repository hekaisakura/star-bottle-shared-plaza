# 星座漂流瓶：真实共享海滩广场版

这个版本不是纯本地 `localStorage`，而是通过 Node 后端保存瓶子数据。

## 运行

```cmd
cd server
npm install
npm start
```

浏览器打开：

```text
http://localhost:3000
```

## 局域网内其他人访问

让其他电脑/手机访问你的电脑 IP，例如：

```text
http://你的电脑IP:3000
```

你的命令行窗口不要关闭。

## 真正不同城市/不同网络的人也能看到

需要把这个项目部署到公网服务器，例如云服务器、Render、Railway、Vercel + 数据库等。

当前版本使用 `data/bottles.json` 保存数据，适合比赛演示和局域网测试。正式上线建议换成数据库。
