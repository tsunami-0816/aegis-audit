package com.ai.audit.service;

import com.ai.audit.dto.ReviewDTO;
import com.ai.audit.dto.WorkorderQueryDTO;
import com.ai.audit.entity.AuditWorkorder;
import com.ai.audit.vo.WorkorderVO;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;

public interface AuditWorkorderService extends IService<AuditWorkorder> {

    IPage<WorkorderVO> getWorkorderList(WorkorderQueryDTO dto);

    AuditWorkorder review(Long workorderId, Long handlerId, ReviewDTO dto);

}