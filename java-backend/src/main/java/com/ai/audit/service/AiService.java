package com.ai.audit.service;

import com.ai.audit.dto.AiAuditResponse;

public interface AiService {

    AiAuditResponse auditText(String requestId, String text);

}