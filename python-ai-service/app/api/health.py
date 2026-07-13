from fastapi import APIRouter

from app.schemas.common import ApiResponse

router = APIRouter(prefix="/api")


@router.get("/health", summary="健康检查", response_model=ApiResponse)
async def health_check():
    return ApiResponse.success(
        data={"status": "healthy", "service": "ai-content-audit-service"},
        message="服务运行正常"
    )