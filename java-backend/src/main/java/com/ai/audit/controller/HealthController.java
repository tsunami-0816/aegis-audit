package com.ai.audit.controller;

import com.ai.audit.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "健康检查", description = "服务健康状态检查")
public class HealthController {

    @GetMapping("/health")
    @Operation(summary = "健康检查", description = "返回服务健康状态")
    public Result<String> health() {
        return Result.success("UP", "UP");
    }

    @GetMapping("/")
    @Operation(summary = "服务首页", description = "服务欢迎页面")
    public Result<String> index() {
        return Result.success("AI Content Audit Platform is running", "OK");
    }

}