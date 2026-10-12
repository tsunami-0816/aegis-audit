package com.aegis.audit.service.impl;

import com.aegis.audit.dto.ReviewDTO;
import com.aegis.audit.dto.WorkorderQueryDTO;
import com.aegis.audit.entity.AuditWorkorder;
import com.aegis.audit.entity.ContentRecord;
import com.aegis.audit.entity.SysUser;
import com.aegis.audit.exception.BusinessException;
import com.aegis.audit.service.AuditWorkorderService;
import com.aegis.audit.service.ContentRecordService;
import com.aegis.audit.service.SysUserService;
import com.aegis.audit.vo.WorkorderVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.aegis.audit.mapper.AuditWorkorderMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
public class AuditWorkorderServiceImpl extends ServiceImpl<AuditWorkorderMapper, AuditWorkorder> implements AuditWorkorderService {

    private final ContentRecordService contentRecordService;
    private final SysUserService sysUserService;

    public AuditWorkorderServiceImpl(
            ContentRecordService contentRecordService,
            SysUserService sysUserService
    ) {
        this.contentRecordService = contentRecordService;
        this.sysUserService = sysUserService;
    }

    @Override
    public IPage<WorkorderVO> getWorkorderList(WorkorderQueryDTO dto) {
        Page<AuditWorkorder> page = new Page<>(dto.getPageNum(), dto.getPageSize());

        LambdaQueryWrapper<AuditWorkorder> wrapper = new LambdaQueryWrapper<>();
        if (dto.getStatus() != null && !dto.getStatus().isEmpty()) {
            wrapper.eq(AuditWorkorder::getStatus, dto.getStatus());
        }
        wrapper.orderByDesc(AuditWorkorder::getCreateTime);

        IPage<AuditWorkorder> workorderPage = page(page, wrapper);

        return workorderPage.convert(workorder -> {
            ContentRecord content = contentRecordService.getById(workorder.getContentId());
            SysUser handler = workorder.getHandlerId() != null ? sysUserService.getById(workorder.getHandlerId()) : null;

            String authorName = null;
            if (content != null) {
                SysUser author = sysUserService.getById(content.getUserId());
                authorName = author != null ? author.getUsername() : null;
            }

            return WorkorderVO.builder()
                    .id(String.valueOf(workorder.getId()))
                    .contentId(String.valueOf(workorder.getContentId()))
                    .content(content != null ? content.getContent() : null)
                    .username(authorName)
                    .riskLevel(content != null ? content.getRiskLevel() : null)
                    .aiResult(content != null ? content.getAuditResult() : null)
                    .handlerId(workorder.getHandlerId() != null ? String.valueOf(workorder.getHandlerId()) : null)
                    .handlerName(handler != null ? handler.getUsername() : null)
                    .status(workorder.getStatus())
                    .contentAuditStatus(content != null ? content.getAuditStatus() : null)
                    .remark(workorder.getRemark())
                    .createTime(workorder.getCreateTime())
                    .updateTime(workorder.getUpdateTime())
                    .build();
        });
    }

    @Override
    public AuditWorkorder review(Long workorderId, Long handlerId, ReviewDTO dto) {
        AuditWorkorder workorder = getById(workorderId);
        if (workorder == null) {
            throw new BusinessException("工单不存在");
        }

        workorder.setHandlerId(handlerId);
        workorder.setStatus("COMPLETED");
        if (dto.getRemark() != null && !dto.getRemark().isEmpty()) {
            workorder.setRemark(dto.getRemark());
        }
        workorder.setUpdateTime(LocalDateTime.now());

        updateById(workorder);

        ContentRecord content = contentRecordService.getById(workorder.getContentId());
        if (content != null) {
            content.setAuditStatus(dto.getAuditStatus());
            if (dto.getAuditResult() != null && !dto.getAuditResult().isEmpty()) {
                content.setAuditResult(dto.getAuditResult());
            }
            if (dto.getRiskLevel() != null && !dto.getRiskLevel().isEmpty()) {
                content.setRiskLevel(dto.getRiskLevel());
            }
            if (dto.getSummary() != null && !dto.getSummary().isEmpty()) {
                content.setSummary(dto.getSummary());
            }
            content.setUpdateTime(LocalDateTime.now());
            contentRecordService.updateById(content);
        }

        log.info("Workorder reviewed: id={}, handlerId={}, status={}", workorderId, handlerId, dto.getAuditStatus());
        return workorder;
    }

    private String truncateContent(String content) {
        if (content == null) {
            return null;
        }
        return content.length() > 100 ? content.substring(0, 100) + "..." : content;
    }

}