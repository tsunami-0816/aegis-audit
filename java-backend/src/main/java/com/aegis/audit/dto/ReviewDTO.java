package com.aegis.audit.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "人工复核请求")
public class ReviewDTO {

    @NotBlank(message = "审核状态不能为空")
    @Schema(description = "审核状态：PENDING/PROCESSING/PASSED/REJECTED", example = "PASSED", requiredMode = Schema.RequiredMode.REQUIRED)
    private String auditStatus;

    @Schema(description = "审核结果详情", example = "审核通过，内容合规")
    private String auditResult;

    @Schema(description = "风险等级：LOW/MEDIUM/HIGH/CRITICAL", example = "LOW")
    private String riskLevel;

    @Schema(description = "审核摘要", example = "内容符合规范")
    private String summary;

    @Schema(description = "备注", example = "人工复核确认")
    private String remark;

}