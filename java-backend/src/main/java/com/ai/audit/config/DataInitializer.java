package com.ai.audit.config;

import com.ai.audit.entity.SysUser;
import com.ai.audit.service.SysUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
public class DataInitializer implements CommandLineRunner {

    private final SysUserService sysUserService;
    private final UserDetailsServiceImpl userDetailsService;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(SysUserService sysUserService, 
                           UserDetailsServiceImpl userDetailsService, 
                           PasswordEncoder passwordEncoder) {
        this.sysUserService = sysUserService;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        SysUser existingAdmin = userDetailsService.getSysUserByUsername("admin");
        if (existingAdmin == null) {
            SysUser admin = new SysUser();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole("ADMIN");
            admin.setCreateTime(LocalDateTime.now());
            admin.setUpdateTime(LocalDateTime.now());
            sysUserService.save(admin);
            log.info("Admin user created successfully");
        } else {
            existingAdmin.setPassword(passwordEncoder.encode("admin"));
            existingAdmin.setRole("ADMIN");
            existingAdmin.setUpdateTime(LocalDateTime.now());
            sysUserService.updateById(existingAdmin);
            log.info("Admin user password updated successfully");
        }
    }
}
