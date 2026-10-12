package com.aegis.audit.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("content_record")
public class ContentRecord {

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("user_id")
    private Long userId;

    @TableField("content")
    private String content;

    @TableField("content_type")
    private String contentType;

    @TableField("audit_status")
    private String auditStatus;

    @TableField("audit_result")
    private String auditResult;

    @TableField("risk_level")
    private String riskLevel;

    @TableField("summary")
    private String summary;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("update_time")
    private LocalDateTime updateTime;

}