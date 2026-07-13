package com.ai.audit.service.impl;

import com.ai.audit.dto.AiAuditResponse;
import com.ai.audit.dto.SubmitContentDTO;
import com.ai.audit.entity.AuditWorkorder;
import com.ai.audit.entity.ContentRecord;
import com.ai.audit.entity.SysUser;
import com.ai.audit.exception.BusinessException;
import com.ai.audit.service.AiService;
import com.ai.audit.service.AuditWorkorderService;
import com.ai.audit.service.ContentRecordService;
import com.ai.audit.service.SysUserService;
import com.ai.audit.vo.ContentDetailVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ai.audit.mapper.ContentRecordMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class ContentRecordServiceImpl extends ServiceImpl<ContentRecordMapper, ContentRecord> implements ContentRecordService {

    private static final String CONTENT_DETAIL_CACHE_KEY = "audit:content:detail:";
    private static final long CACHE_EXPIRE_MINUTES = 5;
    private static final String HIGH_RISK_LEVEL = "HIGH";
    private static final String MEDIUM_RISK_LEVEL = "MEDIUM";

    private final SysUserService sysUserService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final AiService aiService;
    private final AuditWorkorderService auditWorkorderService;

    public ContentRecordServiceImpl(
            SysUserService sysUserService,
            RedisTemplate<String, Object> redisTemplate,
            AiService aiService,
            @Lazy AuditWorkorderService auditWorkorderService
    ) {
        this.sysUserService = sysUserService;
        this.redisTemplate = redisTemplate;
        this.aiService = aiService;
        this.auditWorkorderService = auditWorkorderService;
    }

    @Override
    public ContentRecord submitContent(Long userId, SubmitContentDTO dto) {
        SysUser user = sysUserService.getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        ContentRecord record = new ContentRecord();
        record.setUserId(userId);
        record.setContent(dto.getContent());
        record.setContentType(dto.getContentType() != null ? dto.getContentType() : "TEXT");
        record.setAuditStatus("PENDING");
        record.setCreateTime(LocalDateTime.now());
        record.setUpdateTime(LocalDateTime.now());

        save(record);

        String requestId = UUID.randomUUID().toString();
        log.info("[SUBMIT_CONTENT] requestId={}, userId={}, contentId={}, contentLength={}",
                requestId, userId, record.getId(), dto.getContent().length());

        AiAuditResponse auditResponse = aiService.auditText(requestId, dto.getContent());

        if (auditResponse != null && auditResponse.getCode() != null && auditResponse.getCode() == 200
                && auditResponse.getData() != null) {

            AiAuditResponse.AuditData auditData = auditResponse.getData();
            record.setAuditResult(auditData.getSuggestion());
            record.setRiskLevel(auditData.getRiskLevel());

            if (HIGH_RISK_LEVEL.equalsIgnoreCase(auditData.getRiskLevel()) || 
                    MEDIUM_RISK_LEVEL.equalsIgnoreCase(auditData.getRiskLevel())) {
                record.setAuditStatus("PROCESSING");
                createWorkorder(requestId, record.getId());
                log.info("[SUBMIT_CONTENT] requestId={}, contentId={}, {} risk detected, workorder created",
                        requestId, record.getId(), auditData.getRiskLevel());
            } else {
                record.setAuditStatus("PASSED");
                log.info("[SUBMIT_CONTENT] requestId={}, contentId={}, audit passed, riskLevel={}",
                        requestId, record.getId(), auditData.getRiskLevel());
            }

            updateById(record);
        } else {
            record.setAuditStatus("PENDING");
            record.setAuditResult("AI审核服务调用失败，等待人工审核");
            record.setRiskLevel("MEDIUM");
            updateById(record);
            createWorkorder(requestId, record.getId());
            log.warn("[SUBMIT_CONTENT] requestId={}, contentId={}, AI audit failed, fallback to manual review",
                    requestId, record.getId());
        }

        log.info("[SUBMIT_CONTENT] requestId={}, contentId={}, finalStatus={}",
                requestId, record.getId(), record.getAuditStatus());
        return record;
    }

    private void createWorkorder(String requestId, Long contentId) {
        SysUser adminUser = sysUserService.lambdaQuery()
                .eq(SysUser::getRole, "ADMIN")
                .last("LIMIT 1")
                .one();

        AuditWorkorder workorder = new AuditWorkorder();
        workorder.setContentId(contentId);
        workorder.setHandlerId(adminUser != null ? adminUser.getId() : null);
        workorder.setStatus("ASSIGNED");
        workorder.setRemark("AI检测到高风险内容，需要人工复核");
        workorder.setCreateTime(LocalDateTime.now());
        workorder.setUpdateTime(LocalDateTime.now());

        auditWorkorderService.save(workorder);
        log.info("[CREATE_WORKORDER] requestId={}, contentId={}, workorderId={}, handlerId={}",
                requestId, contentId, workorder.getId(), workorder.getHandlerId());
    }

    @Override
    @SuppressWarnings("unchecked")
    public ContentDetailVO getContentDetail(Long id) {
        String cacheKey = CONTENT_DETAIL_CACHE_KEY + id;

        Object cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return (ContentDetailVO) cached;
        }

        ContentRecord record = getById(id);
        if (record == null) {
            throw new BusinessException("记录不存在");
        }

        SysUser user = sysUserService.getById(record.getUserId());

        ContentDetailVO vo = ContentDetailVO.builder()
                .id(record.getId())
                .userId(record.getUserId())
                .username(user != null ? user.getUsername() : null)
                .content(record.getContent())
                .contentType(record.getContentType())
                .auditStatus(record.getAuditStatus())
                .auditResult(record.getAuditResult())
                .riskLevel(record.getRiskLevel())
                .summary(record.getSummary())
                .createTime(record.getCreateTime())
                .updateTime(record.getUpdateTime())
                .build();

        redisTemplate.opsForValue().set(cacheKey, vo, CACHE_EXPIRE_MINUTES, TimeUnit.MINUTES);

        return vo;
    }

    @Override
    public java.util.List<ContentDetailVO> listByUserId(Long userId) {
        java.util.List<ContentRecord> records = lambdaQuery()
                .eq(ContentRecord::getUserId, userId)
                .orderByDesc(ContentRecord::getCreateTime)
                .list();

        return records.stream().map(this::convertToVO).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public java.util.List<ContentDetailVO> listAll() {
        java.util.List<ContentRecord> records = lambdaQuery()
                .orderByDesc(ContentRecord::getCreateTime)
                .list();

        return records.stream().map(this::convertToVO).collect(java.util.stream.Collectors.toList());
    }

    private ContentDetailVO convertToVO(ContentRecord record) {
        SysUser user = sysUserService.getById(record.getUserId());
        return ContentDetailVO.builder()
                .id(record.getId())
                .userId(record.getUserId())
                .username(user != null ? user.getUsername() : null)
                .content(record.getContent())
                .contentType(record.getContentType())
                .auditStatus(record.getAuditStatus())
                .auditResult(record.getAuditResult())
                .riskLevel(record.getRiskLevel())
                .summary(record.getSummary())
                .createTime(record.getCreateTime())
                .updateTime(record.getUpdateTime())
                .build();
    }

}