# AegisAudit

基于 Java + Python 双栈后端的 AI 内容审核平台，提供用户内容提交、AI 智能审核、工单管理等功能。

## ✨ Features

- **用户管理**：注册、登录、编辑资料、忘记密码
- **内容审核**：用户提交内容，AI 自动审核，风险等级判定
- **工单管理**：管理员处理审核工单，支持通过/拒绝操作
- **角色权限**：管理员/普通用户角色分离，菜单权限控制
- **仪表盘**：数据统计概览，最近提交/待审核工单展示

## 🛠 Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS 3
- Zustand (State Management)
- Lucide React (Icons)

### Backend
- Java 17
- Spring Boot 3.2
- Spring Security
- MyBatis Plus
- JWT Authentication
- Redis (Session Management)
- MySQL 8.0

### AI Service
- Python 3.11
- FastAPI
- Pydantic
- Rule-based Content Moderation

### DevOps
- Docker Compose

## 📁 Project Structure

```
aegis-audit/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── pages/           # Page Components
│   │   ├── components/      # UI Components
│   │   ├── services/        # API Services
│   │   ├── store/           # Zustand Stores
│   │   └── types/           # TypeScript Types
│   └── package.json
├── java-backend/            # Spring Boot Backend
│   ├── src/main/java/com/ai/audit/
│   │   ├── controller/      # REST Controllers
│   │   ├── service/         # Business Logic
│   │   ├── entity/          # Database Entities
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── config/          # Configuration
│   │   └── filter/          # Security Filters
│   └── pom.xml
├── python-ai-service/       # AI Moderation Service
│   ├── app/
│   │   ├── api/             # FastAPI Routes
│   │   ├── service/         # AI Service Logic
│   │   └── schemas/         # Pydantic Models
│   └── requirements.txt
├── docker-compose.yml        # Docker Compose Configuration
└── .env.example             # Environment Variables Template
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for frontend development)

### Start with Docker

```bash
# Clone the repository
git clone https://github.com/tsunami-0816/aegis-audit.git
cd aegis-audit

# Copy environment variables
cp .env.example .env

# Start all services (MySQL, Redis, Java Backend, Python AI Service)
docker compose up -d

# Start frontend development server
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 (dev) | React Development Server |
| Java Backend | 8081 | Spring Boot API |
| Python AI Service | 8001 | AI Content Moderation |
| MySQL | 3309 | Database |
| Redis | 6380 | Cache |

### Access

- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8081/api/doc.html
- **AI Service**: http://localhost:8001/docs

## 🔐 Default Accounts

| Username | Password | Role |
|----------|----------|------|
| admin | admin | ADMIN |
| user | user123 | USER |

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/reset-password` - 重置密码
- `PUT /api/auth/profile` - 更新资料

### Content
- `POST /api/content/submit` - 提交内容审核
- `GET /api/content/list` - 获取内容列表
- `GET /api/content/{id}` - 获取内容详情

### Workorder
- `GET /api/workorder` - 获取工单列表
- `GET /api/workorder/{id}` - 获取工单详情
- `POST /api/workorder/{id}/review` - 审核工单

### Dashboard
- `GET /api/dashboard/stats` - 获取统计数据

## 📋 Usage

1. **注册账号**：选择普通用户或管理员角色
2. **提交内容**：普通用户提交文本内容进行审核
3. **AI审核**：系统自动调用AI服务进行风险检测
4. **处理工单**：管理员审核高/中风险内容，支持通过或拒绝
5. **查看状态**：用户可在仪表盘查看审核结果

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is for educational purposes.

## 📧 Contact

For issues or questions, please open an issue in the repository.
