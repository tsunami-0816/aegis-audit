# AegisAudit - Docker部署指南

## 环境要求

- Docker 20.10+
- Docker Compose 2.0+

## 目录结构

```
Project3/
├── java-backend/          # Java后端服务
├── python-ai-service/     # Python AI服务
├── docker-compose.yml     # Docker Compose配置
├── .dockerignore          # Docker忽略文件
└── DEPLOY.md              # 部署说明
```

## 服务列表

| 服务名 | 容器名 | 端口 | 说明 |
|--------|--------|------|------|
| mysql | aegis-audit-mysql | 3306 | MySQL数据库 |
| redis | aegis-audit-redis | 6379 | Redis缓存 |
| java-backend | aegis-audit-backend | 8080 | Java后端API |
| python-ai-service | aegis-audit-ai-service | 8000 | Python AI服务 |

## 启动服务

### 首次启动（后台模式）

```bash
cd Project3
docker compose up -d
```

### 首次启动（前台模式，查看日志）

```bash
cd Project3
docker compose up
```

### 启动指定服务

```bash
docker compose up -d java-backend
```

## 停止服务

### 停止所有服务（保留数据）

```bash
docker compose down
```

### 停止所有服务（删除数据卷）

```bash
docker compose down -v
```

### 停止指定服务

```bash
docker compose stop java-backend
```

## 查看日志

### 查看所有服务日志

```bash
docker compose logs
```

### 查看指定服务日志

```bash
docker compose logs java-backend
docker compose logs python-ai-service
docker compose logs mysql
docker compose logs redis
```

### 实时查看日志（tail）

```bash
docker compose logs -f java-backend
```

### 查看最近N行日志

```bash
docker compose logs --tail=100 java-backend
```

## 环境变量

可以通过创建 `.env` 文件覆盖默认配置：

```bash
cp .env.example .env
```

`.env` 文件示例：

```env
MYSQL_ROOT_PASSWORD=your_password
MYSQL_DATABASE=aegis_audit
REDIS_PASSWORD=your_redis_password
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=86400000
```

## 访问地址

### 后端API
- 基础地址: http://localhost:8080/api
- Knife4j文档: http://localhost:8080/api/doc.html

### Python AI服务
- 基础地址: http://localhost:8000/api
- Swagger文档: http://localhost:8000/docs

### 数据库
- MySQL: localhost:3306 (root/配置的密码)
- Redis: localhost:6379 (配置的密码)

## 服务依赖关系

```
mysql → redis → java-backend → python-ai-service
```

- MySQL 和 Redis 并行启动
- Java后端等待 MySQL 和 Redis 健康检查通过后启动
- Python AI服务等待 Java后端健康检查通过后启动

## 数据库初始化

首次启动时，MySQL会自动执行 `java-backend/src/main/resources/db/schema.sql` 初始化表结构。

## 常用命令

### 查看服务状态

```bash
docker compose ps
```

### 重启服务

```bash
docker compose restart java-backend
```

### 进入容器

```bash
docker compose exec mysql bash
docker compose exec redis redis-cli
docker compose exec java-backend bash
```

### 构建镜像

```bash
docker compose build
```

### 强制重新构建镜像

```bash
docker compose build --no-cache
```

## 数据持久化

- MySQL数据存储在 `mysql_data` 卷中
- Redis数据存储在 `redis_data` 卷中
- 执行 `docker compose down -v` 会删除这些卷，导致数据丢失

## 故障排查

### 服务启动失败

1. 查看日志

```bash
docker compose logs <service-name>
```

2. 检查端口是否被占用

```bash
netstat -tlnp | grep 8080
```

3. 检查MySQL连接

```bash
docker compose exec mysql mysql -u root -p -e "SELECT 1"
```

4. 检查Redis连接

```bash
docker compose exec redis redis-cli ping
```

### 健康检查失败

如果服务健康检查失败，可能是启动时间较长，可适当增加 `start_period` 参数。

### Java后端连接MySQL失败

确保 `DB_URL` 环境变量中的主机名为 `mysql`（Docker网络内服务名），而非 `localhost`。

### Java后端连接Redis失败

确保 `REDIS_HOST` 环境变量中的主机名为 `redis`（Docker网络内服务名），而非 `localhost`。