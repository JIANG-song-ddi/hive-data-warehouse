# E-Commerce Data Warehouse System - Project Reproduction Guide

## Project Overview

This project is a complete e-commerce data warehouse system built with Hadoop HDFS, Hive, Spark, Docker, Spring Boot, and Vue.js, implementing a standard 4-layer architecture (ODS/DWD/DWB/DM).

## Project Structure

```
hive-data-warehouse/
├── README.md                      # Project documentation
├── PROJECT_GUIDE.md               # This file - Project reproduction guide
├── docker-compose.yml             # Docker Compose file
├── hadoop.env                     # Hadoop environment config
├── start.ps1                      # Windows startup script
├── stop.ps1                       # Windows stop script
│
├── dwh/                           # Data warehouse SQL files
│   ├── ods/                       # ODS layer DDL
│   ├── dwd/                       # DWD layer DDL
│   ├── dwb/                       # DWB layer DDL
│   └── dm/                        # DM layer DDL
│
├── spark-etl/                     # Spark ETL project
│   ├── pom.xml                    # Maven config
│   └── src/main/scala/com/ecommerce/etl/
│       ├── EtlConfig.scala        # Spark configuration
│       ├── OdsToDwdEtl.scala      # ODS → DWD ETL
│       ├── DwdToDwbEtl.scala      # DWD → DWB ETL
│       └── DwbToDmEtl.scala       # DWB → DM ETL
│
├── backend/                       # Spring Boot backend
│   ├── pom.xml                    # Maven config
│   ├── Dockerfile                 # Backend Dockerfile
│   └── src/main/java/com/ecommerce/dw/
│       ├── EcommerceDataWarehouseApplication.java
│       ├── config/                # Configuration classes
│       ├── controller/            # Controllers
│       └── service/               # Business logic
│
├── frontend/                      # Vue.js frontend
│   ├── package.json               # npm config
│   ├── vue.config.js              # Vue config
│   ├── Dockerfile                 # Frontend Dockerfile
│   ├── nginx.conf                 # Nginx config
│   └── src/
│       ├── main.js                # Entry file
│       ├── App.vue                # Root component
│       ├── router/                # Router config
│       ├── api/                   # API interfaces
│       └── views/                 # Page components
│
└── mysql-init/                    # MySQL initialization
    └── init.sql                   # Database init script
```

## Environment Requirements

### Required Software

1. **Docker Desktop** (20.10+)
   - Windows users: [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
   - Ensure WSL2 backend is enabled

2. **Git** (optional, for cloning)
   - [Download Git](https://git-scm.com/downloads)

### System Requirements

- **OS**: Windows 10/11, macOS, or Linux
- **Memory**: 8GB RAM minimum (16GB recommended)
- **Disk Space**: 50GB minimum
- **Network**: Stable internet connection for Docker images

## Quick Start

### Option 1: Using Docker Compose (Recommended)

#### Windows Users

1. **Open PowerShell**, navigate to project directory
   ```powershell
   cd hive-data-warehouse
   ```

2. **Run startup script**
   ```powershell
   .\start.ps1
   ```

3. **Wait for services to start** (approx. 3-5 minutes)

4. **Access the system**
   - Frontend UI: http://localhost:8888
   - Backend API: http://localhost:8085

#### Manual Start (All Platforms)

```bash
# Navigate to project directory
cd hive-data-warehouse

# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Option 2: Local Development Mode (Without Docker)

If Docker environment setup is difficult, use local development mode:

#### 1. Start Backend

**Requirements**: JDK 8+, Maven 3.6+

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will start on http://localhost:8085

#### 2. Start Frontend

**Requirements**: Node.js 16+, npm

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run serve
```

Frontend will start on http://localhost:3000

## Data Warehouse Initialization

### 1. Create Hive Tables

Connect to Hive and execute DDL scripts:

```bash
# Enter Hive container
docker exec -it hive-server hive

# Execute SQL files in Hive
source /dwh/ods/ods_create_tables.sql;
source /dwh/dwd/dwd_create_tables.sql;
source /dwh/dwb/dwb_create_tables.sql;
source /dwh/dm/dm_create_tables.sql;
```

### 2. Run ETL Tasks

```bash
# Submit ODS → DWD ETL task
docker exec -it spark-master spark-submit \
  --class com.ecommerce.etl.OdsToDwdEtl \
  --master spark://spark-master:7077 \
  /app/spark-etl.jar

# Submit DWD → DWB ETL task
docker exec -it spark-master spark-submit \
  --class com.ecommerce.etl.DwdToDwbEtl \
  --master spark://spark-master:7077 \
  /app/spark-etl.jar

# Submit DWB → DM ETL task
docker exec -it spark-master spark-submit \
  --class com.ecommerce.etl.DwbToDmEtl \
  --master spark://spark-master:7077 \
  /app/spark-etl.jar
```

## Common Issues

### Q1: Docker Start Failure

**Problem**: Ports are in use or services won't start.

**Solution**:
1. Check port usage: `netstat -ano | findstr :3306`
2. Stop process using the port
3. Or modify port mappings in docker-compose.yml

### Q2: Out of Memory

**Problem**: Docker containers crash due to insufficient memory.

**Solution**:
1. Increase Docker Desktop memory limit (Settings -> Resources -> Memory)
2. Recommend at least 8GB for Docker

### Q3: Image Pull Failure

**Problem**: Cannot pull images from Docker Hub.

**Solution**:
1. Configure Docker China mirror sources
2. Edit Docker Desktop settings, add accelerators:
   - https://docker.mirrors.ustc.edu.cn
   - https://hub-mirror.c.163.com

### Q4: Frontend Dependency Installation Failed

**Problem**: npm install errors.

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Use Taobao mirror
npm config set registry https://registry.npmmirror.com

# Reinstall
npm install
```

### Q5: Backend Compilation Failed

**Problem**: Maven dependency download fails.

**Solution**:
```xml
<!-- Add Aliyun mirror in pom.xml -->
<mirrors>
  <mirror>
    <id>aliyunmaven</id>
    <mirrorOf>*</mirrorOf>
    <name>Aliyun Public Repository</name>
    <url>https://maven.aliyun.com/repository/public</url>
  </mirror>
</mirrors>
```

## Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 8888 | Vue Application |
| Backend | 8085 | Spring Boot Service |
| MySQL | 3306 | Business Database |
| HDFS NameNode | 9870 | HDFS Web UI |
| YARN | 8088 | YARN Web UI |
| Spark Master | 8080 | Spark Web UI |
| HiveServer2 | 10000 | Hive JDBC Port |

## Features

### Dashboard
- Core metrics display (sales, orders, users, products)
- Sales trend charts
- User growth trends
- Category sales distribution
- Payment method breakdown

### Sales Analysis
- Daily/weekly/monthly sales trends
- Order completion rate analysis
- Average order value analysis

### Product Analysis
- Product sales rankings
- Category sales analysis
- Price range distribution

### User Analysis
- User profiling
- User segmentation
- User retention analysis

### System Management
- Product management (CRUD operations)
- User management (CRUD operations)
- Order management (CRUD operations)

## Tech Stack

### Big Data Technologies
- **Hadoop HDFS**: Distributed file storage
- **Hive**: Data warehouse tool
- **Spark**: Distributed computing engine
- **YARN**: Resource management system

### Web Technologies
- **Backend**: Spring Boot 2.7, Java 8
- **Frontend**: Vue.js 3, Element Plus, ECharts
- **Database**: MySQL 8.0
- **Containerization**: Docker, Docker Compose

## Project Highlights

1. **4-Layer Data Warehouse Architecture**: ODS, DWD, DWB, DM standard layers
2. **Dimensional Modeling**: Star schema design
3. **Performance Optimization**: Parquet columnar storage, Snappy compression, Spark AQE
4. **Complete Web Application**: Frontend-backend separation with data visualization
5. **Containerized Deployment**: Docker one-click start for easy reproduction

## Support

For questions, please check:
- README.md - Detailed project documentation
- GitHub Issues - For bug reports and feature requests

## License

MIT License
