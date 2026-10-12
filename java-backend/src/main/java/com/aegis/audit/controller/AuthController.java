package com.aegis.audit.controller;

import com.aegis.audit.common.Result;
import com.aegis.audit.config.UserDetailsServiceImpl;
import com.aegis.audit.dto.LoginDTO;
import com.aegis.audit.dto.RegisterDTO;
import com.aegis.audit.dto.ResetPasswordDTO;
import com.aegis.audit.dto.UpdateProfileDTO;
import com.aegis.audit.entity.SysUser;
import com.aegis.audit.exception.BusinessException;
import com.aegis.audit.service.SysUserService;
import com.aegis.audit.utils.JwtUtil;
import com.aegis.audit.vo.LoginVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/auth")
@Tag(name = "认证接口", description = "用户登录、注册")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final SysUserService sysUserService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserDetailsServiceImpl userDetailsService,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            SysUserService sysUserService
    ) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.sysUserService = sysUserService;
    }

    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "用户登录获取JWT令牌")
    public Result<LoginVO> login(@Valid @RequestBody LoginDTO loginDTO) {
        log.info("User login attempt: {}", loginDTO.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getUsername(),
                        loginDTO.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        SysUser sysUser = userDetailsService.getSysUserByUsername(loginDTO.getUsername());
        String token = jwtUtil.generateToken(sysUser.getUsername());

        LoginVO loginVO = LoginVO.builder()
                .token(token)
                .id(sysUser.getId())
                .username(sysUser.getUsername())
                .role(sysUser.getRole())
                .build();

        log.info("User login success: {}", loginDTO.getUsername());
        return Result.success("登录成功", loginVO);
    }

    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "新用户注册，默认角色为普通用户")
    public Result<Void> register(@Valid @RequestBody RegisterDTO registerDTO) {
        log.info("User registration attempt: {}", registerDTO.getUsername());

        SysUser existingUser = userDetailsService.getSysUserByUsername(registerDTO.getUsername());
        if (existingUser != null) {
            throw new BusinessException("用户名已存在");
        }

        SysUser sysUser = new SysUser();
        sysUser.setUsername(registerDTO.getUsername());
        sysUser.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        String role = registerDTO.getRole();
        if (!"ADMIN".equals(role) && !"USER".equals(role)) {
            role = "USER";
        }
        sysUser.setRole(role);
        sysUser.setCreateTime(LocalDateTime.now());
        sysUser.setUpdateTime(LocalDateTime.now());

        sysUserService.save(sysUser);

        log.info("User registration success: {}", registerDTO.getUsername());
        return Result.success("注册成功");
    }

    @PutMapping("/profile")
    @Operation(summary = "更新用户资料", description = "用户更新个人资料，包括用户名和密码")
    public Result<Void> updateProfile(@Valid @RequestBody UpdateProfileDTO updateProfileDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getPrincipal() instanceof UserDetails 
            ? ((UserDetails) authentication.getPrincipal()).getUsername()
            : authentication.getPrincipal().toString();

        SysUser sysUser = userDetailsService.getSysUserByUsername(currentUsername);
        if (sysUser == null) {
            throw new BusinessException("用户不存在");
        }

        if (updateProfileDTO.getUsername() != null && !updateProfileDTO.getUsername().isEmpty()) {
            SysUser existingUser = userDetailsService.getSysUserByUsername(updateProfileDTO.getUsername());
            if (existingUser != null && !existingUser.getId().equals(sysUser.getId())) {
                throw new BusinessException("用户名已存在");
            }
            sysUser.setUsername(updateProfileDTO.getUsername());
        }

        if (updateProfileDTO.getPassword() != null && !updateProfileDTO.getPassword().isEmpty()) {
            sysUser.setPassword(passwordEncoder.encode(updateProfileDTO.getPassword()));
        }

        sysUser.setUpdateTime(LocalDateTime.now());
        sysUserService.updateById(sysUser);

        log.info("User profile updated: {}", currentUsername);
        return Result.success("资料更新成功");
    }

    @PostMapping("/reset-password")
    @Operation(summary = "重置密码", description = "根据用户名重置密码")
    public Result<Void> resetPassword(@Valid @RequestBody ResetPasswordDTO resetPasswordDTO) {
        log.info("Password reset attempt for user: {}", resetPasswordDTO.getUsername());

        SysUser sysUser = userDetailsService.getSysUserByUsername(resetPasswordDTO.getUsername());
        if (sysUser == null) {
            throw new BusinessException("用户不存在");
        }

        sysUser.setPassword(passwordEncoder.encode(resetPasswordDTO.getNewPassword()));
        sysUser.setUpdateTime(LocalDateTime.now());
        sysUserService.updateById(sysUser);

        log.info("Password reset success for user: {}", resetPasswordDTO.getUsername());
        return Result.success("密码重置成功");
    }

}