package com.aegis.audit.service.impl;

import com.aegis.audit.entity.SysUser;
import com.aegis.audit.mapper.SysUserMapper;
import com.aegis.audit.service.SysUserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements SysUserService {

}