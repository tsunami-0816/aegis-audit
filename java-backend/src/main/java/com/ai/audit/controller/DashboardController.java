package com.ai.audit.controller;

import com.ai.audit.common.Result;
import com.ai.audit.config.UserDetailsServiceImpl;
import com.ai.audit.entity.ContentRecord;
import com.ai.audit.entity.SysUser;
import com.ai.audit.service.ContentRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Slf4j
@RestController
@RequestMapping("/dashboard")
@Tag(name = "仪表盘", description = "数据统计")
public class DashboardController {

    private final ContentRecordService contentRecordService;
    private final UserDetailsServiceImpl userDetailsService;

    public DashboardController(ContentRecordService contentRecordService,
                              UserDetailsServiceImpl userDetailsService) {
        this.contentRecordService = contentRecordService;
        this.userDetailsService = userDetailsService;
    }

    @GetMapping("/stats")
    @Operation(summary = "统计数据", description = "获取当前用户的统计数据")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Result<DashboardStats> getStats(Authentication authentication) {
        String username = authentication.getName();
        SysUser user = userDetailsService.getSysUserByUsername(username);

        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = LocalDate.now().atTime(LocalTime.MAX);

        Long todaySubmit;
        Long pendingCount;
        Long approvedCount;
        Long rejectedCount;

        if ("ADMIN".equals(user.getRole())) {
            todaySubmit = contentRecordService.lambdaQuery()
                    .ge(ContentRecord::getCreateTime, todayStart)
                    .le(ContentRecord::getCreateTime, todayEnd)
                    .count();

            pendingCount = contentRecordService.lambdaQuery()
                    .in(ContentRecord::getAuditStatus, "PENDING", "PROCESSING")
                    .count();

            approvedCount = contentRecordService.lambdaQuery()
                    .eq(ContentRecord::getAuditStatus, "PASSED")
                    .count();

            rejectedCount = contentRecordService.lambdaQuery()
                    .eq(ContentRecord::getAuditStatus, "REJECTED")
                    .count();
        } else {
            todaySubmit = contentRecordService.lambdaQuery()
                    .eq(ContentRecord::getUserId, user.getId())
                    .ge(ContentRecord::getCreateTime, todayStart)
                    .le(ContentRecord::getCreateTime, todayEnd)
                    .count();

            pendingCount = contentRecordService.lambdaQuery()
                    .eq(ContentRecord::getUserId, user.getId())
                    .in(ContentRecord::getAuditStatus, "PENDING", "PROCESSING")
                    .count();

            approvedCount = contentRecordService.lambdaQuery()
                    .eq(ContentRecord::getUserId, user.getId())
                    .eq(ContentRecord::getAuditStatus, "PASSED")
                    .count();

            rejectedCount = contentRecordService.lambdaQuery()
                    .eq(ContentRecord::getUserId, user.getId())
                    .eq(ContentRecord::getAuditStatus, "REJECTED")
                    .count();
        }

        DashboardStats stats = new DashboardStats(todaySubmit, pendingCount, approvedCount, rejectedCount);
        return Result.success(stats);
    }

    @Data
    @AllArgsConstructor
    public static class DashboardStats {
        private Long todaySubmit;
        private Long pendingCount;
        private Long approvedCount;
        private Long rejectedCount;
    }

}