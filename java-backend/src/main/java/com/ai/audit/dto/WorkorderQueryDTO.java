package com.ai.audit.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "工单查询请求")
public class WorkorderQueryDTO {

    @Schema(description = "工单状态：CREATED/ASSIGNED/PROCESSING/COMPLETED/CANCELLED", example = "PROCESSING")
    private String status;

    @Schema(description = "页码", example = "1", defaultValue = "1")
    private Integer pageNum = 1;

    @Schema(description = "每页大小", example = "10", defaultValue = "10")
    private Integer pageSize = 10;

}