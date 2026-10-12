package com.aegis.audit.config;

import com.aegis.audit.entity.SysUser;
import com.aegis.audit.service.SysUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final SysUserService sysUserService;

    public UserDetailsServiceImpl(SysUserService sysUserService) {
        this.sysUserService = sysUserService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        SysUser sysUser = sysUserService.lambdaQuery()
                .eq(SysUser::getUsername, username)
                .one();

        if (sysUser == null) {
            log.warn("User not found: {}", username);
            throw new UsernameNotFoundException("用户不存在");
        }

        return new User(
                sysUser.getUsername(),
                sysUser.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + sysUser.getRole()))
        );
    }

    public SysUser getSysUserByUsername(String username) {
        return sysUserService.lambdaQuery()
                .eq(SysUser::getUsername, username)
                .one();
    }

}