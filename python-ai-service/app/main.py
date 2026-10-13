from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.api.health import router as health_router
from app.api.ai import router as ai_router

app = FastAPI(
    title="AegisAudit AI Service",
    description="AegisAudit AI 能力服务",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, tags=["健康检查"])
app.include_router(ai_router)

@app.get("/", summary="服务首页")
async def root():
    return {
        "code": 200,
        "message": "AegisAudit AI Service is running",
        "data": None
    }

@app.get("/api", summary="API根路径")
async def api_root():
    return {
        "code": 200,
        "message": "AegisAudit AI Service API",
        "data": {
            "endpoints": [
                "/api/health",
                "/api/ai/text-audit",
                "/api/ai/summary"
            ],
            "docs": "/docs"
        }
    }