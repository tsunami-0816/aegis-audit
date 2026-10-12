package com.aegis.audit.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "内容审核详情")
public class ContentDetailVO {

    @Schema(description = "记录ID")
    private Long id;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "用户名")
    private String username;

    @Schema(description = "待审核内容")
    private String content;

    @Schema(description = "内容类型")
    private String contentType;

    @Schema(description = "审核状态")
    private String auditStatus;

    @Schema(description = "审核结果详情")
    private String auditResult;

    @Schema(description = "风险等级")
    private String riskLevel;

    @Schema(description = "审核摘要")
    private String summary;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;

}