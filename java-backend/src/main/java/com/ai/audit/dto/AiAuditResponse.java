package com.ai.audit.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class AiAuditResponse {

    private Integer code;
    private String message;
    private AuditData data;

    @Data
    public static class AuditData {
        @JsonProperty("risk_level")
        private String riskLevel;
        @JsonProperty("violation_type")
        private String violationType;
        private String suggestion;
    }

}