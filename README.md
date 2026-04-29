# 电商数据仓库系统

基于 Hadoop HDFS、Hive、Spark、Docker、Spring Boot 和 Vue.js 的完整电商数据仓库系统，实现了 ODS、DWD、DWB、DM 四层规范分层架构。

![GitHub](https://img.shields.io/github/license/JIANG-song-ddi/hive-data-warehouse)
![GitHub last commit](https://img.shields.io/github/last-commit/JIANG-song-ddi/hive-data-warehouse)
![GitHub repo size](https://img.shields.io/github/repo-size/JIANG-song-ddi/hive-data-warehouse)

---

## 📖 目录

- [项目概述](#-项目概述)
- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [架构设计](#-架构设计)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [API 接口](#-api-接口)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)

---

## 📋 项目概述

本项目是一个基于现代大数据技术构建的完整电商数据仓库系统。实现了标准的四层数据仓库架构（ODS/DWD/DWB/DM），并提供了完整的前后端分离的 Web 应用，支持数据可视化分析。

### 主要特点

- ✅ **四层数据仓库架构**: ODS、DWD、DWB、DM 四层规范分层
- ✅ **维度建模**: 采用星型模型设计
- ✅ **性能优化**: Parquet 列式存储、Snappy 压缩、Spark AQE
- ✅ **完整 Web 应用**: Vue.js 前端 + Spring Boot 后端
- ✅ **容器化部署**: Docker Compose 一键启动

---

## ✨ 功能特性

### 数据看板
- 核心指标展示（销售额、订单量、用户数、商品数）
- 销售趋势图表
- 用户增长趋势
- 分类销售占比
- 支付方式分布

### 销售分析
- 日/周/月销售趋势
- 订单完成率分析
- 客单价分析

### 商品分析
- 商品销售排行
- 分类销售分析
- 价格区间分布

### 用户分析
- 用户画像分析
- 用户分层统计
- 用户留存分析

### 系统管理
- 商品管理（增删改查）
- 用户管理（增删改查）
- 订单管理（增删改查）

---

## 🛠️ 技术栈

### 大数据技术
- **Hadoop HDFS**: 分布式文件存储
- **Hive**: 数据仓库工具
- **Spark**: 分布式计算引擎
- **YARN**: 资源管理系统

### Web 开发
- **后端**: Spring Boot 2.7, Java 8
- **前端**: Vue.js 3, Element Plus, ECharts
- **数据库**: MySQL 8.0
- **容器化**: Docker, Docker Compose

### 构建工具
- **Maven**: Java 构建工具
- **npm**: Node.js 包管理器

---

## 🏗️ 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                    前端 (Vue.js)                           │
│              Element Plus + ECharts                       │
└───────────────────────────┬───────────────────────────────┘
                            │ HTTP/REST API
┌───────────────────────────┴───────────────────────────────┐
│                     后端 (Spring Boot)                    │
│                     数据仓库服务                           │
└───────────────────────────┬───────────────────────────────┘
                            │
┌───────────────────────────┴───────────────────────────────┐
│                     数据仓库分层                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   DM     │  │   DWB    │  │   DWD    │  │   ODS    │  │
│  │ (数据集市)│  │ (基础层)  │  │ (明细层)  │  │ (操作层)  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└───────────────────────────┬───────────────────────────────┘
                            │
┌───────────────────────────┴───────────────────────────────┐
│                    Hive + HDFS + Spark                    │
└───────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────┴───────────────────────────────┐
│                    MySQL (业务数据库)                      │
└───────────────────────────────────────────────────────────┘
```

---

## 🚀 快速开始

### 环境要求

- **Docker Desktop** (20.10+)
- **Git** (可选，用于克隆项目)
- **内存**: 至少 8GB RAM（推荐 16GB）
- **磁盘空间**: 至少 50GB

### 使用 Docker Compose（推荐）

```bash
# 克隆仓库
git clone https://github.com/JIANG-song-ddi/hive-data-warehouse.git
cd hive-data-warehouse

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 访问应用

| 服务 | URL | 说明 |
|------|-----|------|
| 前端 | http://localhost:8888 | Vue.js 应用 |
| 后端 API | http://localhost:8085 | Spring Boot API |
| HDFS UI | http://localhost:9870 | HDFS 管理界面 |
| Spark UI | http://localhost:8080 | Spark 管理界面 |

### 本地开发模式（无需 Docker）

#### 启动后端

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

后端将在 http://localhost:8085 启动

#### 启动前端

```bash
cd frontend
npm install
npm run serve
```

前端将在 http://localhost:3000 启动

---

## 📁 项目结构

```
hive-data-warehouse/
├── README.md
├── PROJECT_GUIDE.md
├── docker-compose.yml
├── hadoop.env
├── start.ps1
├── stop.ps1
│
├── dwh/
│   ├── ods/
│   ├── dwd/
│   ├── dwb/
│   └── dm/
│
├── spark-etl/
│   ├── pom.xml
│   └── src/main/scala/com/ecommerce/etl/
│       ├── EtlConfig.scala
│       ├── OdsToDwdEtl.scala
│       ├── DwdToDwbEtl.scala
│       └── DwbToDmEtl.scala
│
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/com/ecommerce/dw/
│       ├── EcommerceDataWarehouseApplication.java
│       ├── config/
│       ├── controller/
│       └── service/
│
├── frontend/
│   ├── package.json
│   ├── vue.config.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── router/
│       ├── api/
│       └── views/
│
└── mysql-init/
    └── init.sql
```

---

## 🔌 API 接口

### 销售概览

```http
GET /api/dw/sales/overview
```

**参数**:
- `startDate` (可选): 开始日期 (YYYY-MM-DD)
- `endDate` (可选): 结束日期 (YYYY-MM-DD)

### 商品销售

```http
GET /api/dw/product/sales
```

**参数**:
- `date` (可选): 分析日期 (YYYY-MM-DD)
- `limit` (可选): 返回数量 (默认: 10)

### 用户分析

```http
GET /api/dw/user/overview
```

**参数**:
- `startDate` (可选): 开始日期 (YYYY-MM-DD)
- `endDate` (可选): 结束日期 (YYYY-MM-DD)

---

## 🛡️ 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端 | 8888 | Vue 应用 |
| 后端 | 8085 | Spring Boot 服务 |
| MySQL | 3306 | 业务数据库 |
| HDFS NameNode | 9870 | HDFS Web UI |
| YARN | 8088 | YARN Web UI |
| Spark Master | 8080 | Spark Web UI |
| HiveServer2 | 10000 | Hive JDBC 端口 |

---

## 🐛 常见问题

### Docker 启动失败

**问题**: 端口被占用或服务无法启动

**解决**:
1. 检查端口占用: `netstat -ano | findstr :3306`
2. 停止占用端口的进程
3. 或修改 docker-compose.yml 中的端口映射

### 内存不足

**问题**: Docker 容器因内存不足而崩溃

**解决**:
1. 增加 Docker Desktop 的内存限制（Settings -> Resources -> Memory）
2. 建议分配至少 8GB 内存给 Docker

### 镜像拉取失败

**问题**: 无法从 Docker Hub 拉取镜像

**解决**:
1. 配置 Docker 国内镜像源
2. 编辑 Docker Desktop 设置，添加镜像加速器:
   - https://docker.mirrors.ustc.edu.cn
   - https://hub-mirror.c.163.com

### 前端依赖安装失败

**问题**: npm install 报错

**解决**:
```bash
# 清除 npm 缓存
npm cache clean --force

# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

---

## 🤝 贡献指南

欢迎贡献代码！请提交 Pull Request。

### 贡献步骤

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

感谢所有使这个项目成为可能的开源项目！

---

**享受项目！🎉**

---

*最后更新: 2026.4*
