package com.aegis.audit.controller;

import com.aegis.audit.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping("/")
    public Result<String> root() {
        return Result.success("AI Content Audit Platform is running", "OK");
    }

}