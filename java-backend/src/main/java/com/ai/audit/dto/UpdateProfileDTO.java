package com.ai.audit.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileDTO {

    @Size(min = 3, max = 50, message = "用户名长度必须在3-50之间")
    private String username;

    @Size(min = 6, max = 100, message = "密码长度必须在6-100之间")
    private String password;

}
