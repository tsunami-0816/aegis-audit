package com.aegis.audit.service;

import com.aegis.audit.dto.AiAuditResponse;

public interface AiService {

    AiAuditResponse auditText(String requestId, String text);

}