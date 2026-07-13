package com.ai.audit.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "提交审核内容请求")
public class SubmitContentDTO {

    @NotBlank(message = "内容不能为空")
    @Size(max = 10000, message = "内容长度不能超过10000字符")
    @Schema(description = "待审核内容", example = "需要审核的文本内容", requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;

    @Schema(description = "内容类型：TEXT/IMAGE/VIDEO/AUDIO", example = "TEXT", defaultValue = "TEXT")
    private String contentType = "TEXT";

}