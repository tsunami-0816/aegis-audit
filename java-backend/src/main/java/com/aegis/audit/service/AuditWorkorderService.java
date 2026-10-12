package com.aegis.audit.service;

import com.aegis.audit.dto.ReviewDTO;
import com.aegis.audit.dto.WorkorderQueryDTO;
import com.aegis.audit.entity.AuditWorkorder;
import com.aegis.audit.vo.WorkorderVO;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;

public interface AuditWorkorderService extends IService<AuditWorkorder> {

    IPage<WorkorderVO> getWorkorderList(WorkorderQueryDTO dto);

    AuditWorkorder review(Long workorderId, Long handlerId, ReviewDTO dto);

}