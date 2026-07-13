package com.ai.audit.vo;

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
@Schema(description = "审核工单")
public class WorkorderVO {

    @Schema(description = "工单ID")
    private String id;

    @Schema(description = "内容记录ID")
    private String contentId;

    @Schema(description = "待审核内容")
    private String content;

    @Schema(description = "作者")
    private String username;

    @Schema(description = "风险等级")
    private String riskLevel;

    @Schema(description = "AI审核结果")
    private String aiResult;

    @Schema(description = "处理人ID")
    private String handlerId;

    @Schema(description = "处理人名称")
    private String handlerName;

    @Schema(description = "工单状态")
    private String status;

    @Schema(description = "内容审核状态")
    private String contentAuditStatus;

    @Schema(description = "备注")
    private String remark;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;

}