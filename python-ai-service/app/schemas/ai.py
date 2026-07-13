from pydantic import BaseModel, Field


class TextAuditRequest(BaseModel):
    text: str = Field(..., description="待审核文本内容", min_length=1)


class TextAuditResponse(BaseModel):
    risk_level: str = Field(..., description="风险等级：LOW/MEDIUM/HIGH")
    violation_type: str = Field(..., description="违规类型：NONE/PORNOGRAPHY/VOLENCE/ADVERTISING/POLITICAL")
    suggestion: str = Field(..., description="审核建议")


class TextSummaryRequest(BaseModel):
    text: str = Field(..., description="待摘要长文本", min_length=1)
    max_length: int = Field(default=100, description="摘要最大长度", ge=10, le=500)


class TextSummaryResponse(BaseModel):
    summary: str = Field(..., description="摘要文本")
    original_length: int = Field(..., description="原文本长度")
    summary_length: int = Field(..., description="摘要长度")