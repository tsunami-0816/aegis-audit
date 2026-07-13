package com.ai.audit.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BaseVO {

    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}