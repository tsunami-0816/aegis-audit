package com.aegis.audit.controller;

import com.aegis.audit.common.Result;
import com.aegis.audit.config.UserDetailsServiceImpl;
import com.aegis.audit.dto.ReviewDTO;
import com.aegis.audit.dto.WorkorderQueryDTO;
import com.aegis.audit.entity.AuditWorkorder;
import com.aegis.audit.entity.ContentRecord;
import com.aegis.audit.entity.SysUser;
import com.aegis.audit.service.AuditWorkorderService;
import com.aegis.audit.service.ContentRecordService;
import com.aegis.audit.service.SysUserService;
import com.aegis.audit.vo.WorkorderVO;
import com.baomidou.mybatisplus.core.metadata.IPage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/workorder")
@Tag(name = "审核工单", description = "工单列表查询、人工复核")
public class WorkorderController {

    private final AuditWorkorderService auditWorkorderService;
    private final UserDetailsServiceImpl userDetailsService;
    private final ContentRecordService contentRecordService;
    private final SysUserService sysUserService;

    public WorkorderController(AuditWorkorderService auditWorkorderService, UserDetailsServiceImpl userDetailsService, ContentRecordService contentRecordService, SysUserService sysUserService) {
        this.auditWorkorderService = auditWorkorderService;
        this.userDetailsService = userDetailsService;
        this.contentRecordService = contentRecordService;
        this.sysUserService = sysUserService;
    }

    @GetMapping("/list")
    @Operation(summary = "工单列表", description = "管理员分页查询审核工单，支持按状态筛选")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<IPage<WorkorderVO>> list(
            @Parameter(description = "工单状态") @RequestParam(required = false) String status,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        WorkorderQueryDTO dto = new WorkorderQueryDTO();
        dto.setStatus(status);
        dto.setPageNum(pageNum);
        dto.setPageSize(pageSize);

        IPage<WorkorderVO> page = auditWorkorderService.getWorkorderList(dto);
        return Result.success(page);
    }

    @GetMapping("/{id}")
    @Operation(summary = "工单详情", description = "获取工单详细信息")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<WorkorderVO> detail(@Parameter(description = "工单ID", required = true) @PathVariable Long id) {
        AuditWorkorder workorder = auditWorkorderService.getById(id);
        if (workorder == null) {
            return Result.notFound("工单不存在");
        }

        ContentRecord content = contentRecordService.getById(workorder.getContentId());
        SysUser handler = workorder.getHandlerId() != null ? sysUserService.getById(workorder.getHandlerId()) : null;

        String authorName = null;
            if (content != null) {
                SysUser author = sysUserService.getById(content.getUserId());
                authorName = author != null ? author.getUsername() : null;
            }

            WorkorderVO vo = WorkorderVO.builder()
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

        return Result.success(vo);
    }

    @PostMapping("/{id}/review")
    @Operation(summary = "人工复核", description = "管理员修改审核状态和备注")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<AuditWorkorder> review(
            @Parameter(description = "工单ID", required = true) @PathVariable Long id,
            @Valid @RequestBody ReviewDTO dto,
            Authentication authentication
    ) {
        String username = authentication.getName();
        SysUser user = userDetailsService.getSysUserByUsername(username);

        AuditWorkorder workorder = auditWorkorderService.review(id, user.getId(), dto);
        return Result.success("复核完成", workorder);
    }

}