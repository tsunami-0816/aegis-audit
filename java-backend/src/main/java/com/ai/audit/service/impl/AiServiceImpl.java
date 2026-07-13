package com.ai.audit.service.impl;

import com.ai.audit.dto.AiAuditResponse;
import com.ai.audit.service.AiService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
public class AiServiceImpl implements AiService {

    private static final String TEXT_AUDIT_PATH = "/api/ai/text-audit";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public AiServiceImpl(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public AiAuditResponse auditText(String requestId, String text) {
        long startTime = System.currentTimeMillis();
        String url = aiServiceUrl + TEXT_AUDIT_PATH;

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("text", text);

            String requestJson = objectMapper.writeValueAsString(requestBody);
            log.info("[AI_AUDIT] requestId={}, url={}, request={}", requestId, url, requestJson);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Request-Id", requestId);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            AiAuditResponse response = restTemplate.postForObject(url, entity, AiAuditResponse.class);

            long duration = System.currentTimeMillis() - startTime;
            String responseJson = response != null ? objectMapper.writeValueAsString(response) : "null";
            log.info("[AI_AUDIT] requestId={}, duration={}ms, response={}", requestId, duration, responseJson);

            return response;

        } catch (RestClientException e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[AI_AUDIT] requestId={}, duration={}ms, RestClientException: {}", requestId, duration, e.getMessage(), e);
            return null;
        } catch (JsonProcessingException e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[AI_AUDIT] requestId={}, duration={}ms, JsonProcessingException: {}", requestId, duration, e.getMessage(), e);
            return null;
        }
    }

}