package com.ai.audit.controller;

import com.ai.audit.common.Result;
import com.ai.audit.config.UserDetailsServiceImpl;
import com.ai.audit.dto.SubmitContentDTO;
import com.ai.audit.entity.ContentRecord;
import com.ai.audit.entity.SysUser;
import com.ai.audit.service.ContentRecordService;
import com.ai.audit.vo.ContentDetailVO;
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
@RequestMapping("/content")
@Tag(name = "内容审核", description = "内容提交、审核结果查询")
public class ContentController {

    private final ContentRecordService contentRecordService;
    private final UserDetailsServiceImpl userDetailsService;

    public ContentController(ContentRecordService contentRecordService, UserDetailsServiceImpl userDetailsService) {
        this.contentRecordService = contentRecordService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/submit")
    @Operation(summary = "提交待审核内容", description = "普通用户提交待审核文本，保存到数据库，初始状态为待审核")
    @PreAuthorize("hasRole('USER')")
    public Result<ContentRecord> submit(
            @Valid @RequestBody SubmitContentDTO dto,
            Authentication authentication
    ) {
        String username = authentication.getName();
        SysUser user = userDetailsService.getSysUserByUsername(username);

        ContentRecord record = contentRecordService.submitContent(user.getId(), dto);
        return Result.success("提交成功", record);
    }

    @GetMapping("/{id}")
    @Operation(summary = "查询审核详情", description = "根据ID查询审核详情，结果存入Redis缓存，过期时间5分钟")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Result<ContentDetailVO> getDetail(
            @Parameter(description = "内容记录ID", required = true)
            @PathVariable Long id,
            Authentication authentication
    ) {
        String username = authentication.getName();
        SysUser user = userDetailsService.getSysUserByUsername(username);

        ContentDetailVO detail = contentRecordService.getContentDetail(id);

        if (!user.getRole().equals("ADMIN") && !detail.getUserId().equals(user.getId())) {
            return Result.forbidden("无权访问");
        }

        return Result.success(detail);
    }

    @GetMapping("/list")
    @Operation(summary = "查询内容列表", description = "查询当前用户的内容记录列表")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Result<java.util.List<ContentDetailVO>> list(
            Authentication authentication
    ) {
        String username = authentication.getName();
        SysUser user = userDetailsService.getSysUserByUsername(username);

        if ("ADMIN".equals(user.getRole())) {
            return Result.success(contentRecordService.listAll());
        }

        return Result.success(contentRecordService.listByUserId(user.getId()));
    }

}