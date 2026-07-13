package com.ai.audit.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("audit_workorder")
public class AuditWorkorder {

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("content_id")
    private Long contentId;

    @TableField("handler_id")
    private Long handlerId;

    @TableField("status")
    private String status;

    @TableField("remark")
    private String remark;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("update_time")
    private LocalDateTime updateTime;

}