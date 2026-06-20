# NMR 核磁测试登记表 — 在线系统

## 在线访问

**公网地址：https://nmr-system.onrender.com**

> Render 免费版服务在空闲 15 分钟后会自动休眠，首次访问需等待约 30-60 秒冷启动。页面已内置自动重试机制，无需手动刷新。

### GitHub 仓库
https://github.com/liwy85/nmr-system

---

## 系统简介

基于 Node.js + Express 的核磁测试登记表在线系统，支持多人共享同一份数据。

### 功能
- 样品登记、批量导入/导出
- 多维度筛选（单位/部门、月份、付款状态）
- 费用自动计算（溶剂费 + 测试费 + 调整费）
- CSV 导出（含费用明细和汇总统计）
- 付款状态管理（未付款/已付款）
- 多人共享数据（所有用户访问同一数据库）

---

## 一、本地运行

### 前提
- 已安装 Node.js 18+

### 步骤

```bash
cd nmr-system
npm install
npm start
```

启动后访问 **http://localhost:3000**

局域网内其他电脑可通过 **http://你的IP:3000** 访问。

---

## 二、部署到公网（推荐 Render.com，免费）

### 方法 A：一键部署（推荐）

1. 将 `nmr-system` 文件夹上传到 GitHub 仓库
2. 访问 https://render.com ，注册免费账号
3. 点击 **New** → **Web Service** → 连接你的 GitHub 仓库
4. Render 会自动识别 `render.yaml` 配置：
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Health Check: `/api/health`
5. 点击 **Create Web Service**
6. 等待 1-2 分钟部署完成，获得公网地址（如 `https://nmr-system.onrender.com`）

### 方法 B：Docker 部署

```bash
docker build -t nmr-system .
docker run -d -p 3000:3000 --name nmr nmr-system
```

适用于有 Docker 环境的服务器（阿里云、腾讯云等）。

### 方法 C：其他 Node.js 平台

本项目兼容所有支持 Node.js 的云平台：
- Railway (https://railway.app)
- Fly.io (https://fly.io)
- Vercel (需适配 serverless)
- 自有服务器 + PM2

---

## 三、数据存储

- 数据保存在 `data.json` 文件中（JSON 格式，可直接备份）
- 每次修改自动保存到服务器
- 建议定期备份 `data.json` 文件

### 备份方法

```bash
# 从服务器复制数据文件
cp data.json data-backup-$(date +%Y%m%d).json

# 或通过 API 导出
curl https://你的域名/api/rows > backup.json
```

---

## 四、API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/rows` | 获取全部记录 |
| POST | `/api/rows/batch` | 批量保存（全量覆盖） |
| DELETE | `/api/rows/:id` | 删除单条记录 |

---

## 五、项目结构

```
nmr-system/
├── server.js          # Express 后端服务器
├── package.json       # 依赖配置
├── data.json          # 数据存储（自动生成）
├── Dockerfile         # Docker 部署文件
├── render.yaml        # Render.com 部署配置
├── .gitignore
├── public/
│   └── index.html     # 前端页面
└── README.md          # 本文件
```
