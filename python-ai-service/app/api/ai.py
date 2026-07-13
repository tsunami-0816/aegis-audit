import logging
from fastapi import APIRouter

from app.schemas.ai import (
    TextAuditRequest,
    TextAuditResponse,
    TextSummaryRequest,
    TextSummaryResponse
)
from app.schemas.common import ApiResponse
from app.service.ai_service import ai_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ai", tags=["AI服务"])


@router.post("/text-audit", summary="文本违规检测", response_model=ApiResponse[TextAuditResponse])
async def text_audit(request: TextAuditRequest):
    logger.info(f"[TEXT_AUDIT] Received request, text length: {len(request.text)}")
    result = ai_service.audit_text(request.text)
    logger.info(f"[TEXT_AUDIT] Completed, risk_level: {result.risk_level}, violation_type: {result.violation_type}")
    return ApiResponse.success(data=result.to_dict(), message="检测完成")


@router.post("/summary", summary="文本智能摘要", response_model=ApiResponse[TextSummaryResponse])
async def text_summary(request: TextSummaryRequest):
    logger.info(f"[TEXT_SUMMARY] Received request, text length: {len(request.text)}, max_length: {request.max_length}")
    result = ai_service.summarize_text(request.text, request.max_length)
    logger.info(f"[TEXT_SUMMARY] Completed, original_length: {result.original_length}, summary_length: {result.summary_length}")
    return ApiResponse.success(data=result.to_dict(), message="摘要完成")