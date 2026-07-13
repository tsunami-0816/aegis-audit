package com.ai.audit.service;

import com.ai.audit.dto.SubmitContentDTO;
import com.ai.audit.entity.ContentRecord;
import com.ai.audit.vo.ContentDetailVO;
import com.baomidou.mybatisplus.extension.service.IService;

public interface ContentRecordService extends IService<ContentRecord> {

    ContentRecord submitContent(Long userId, SubmitContentDTO dto);

    ContentDetailVO getContentDetail(Long id);

    java.util.List<ContentDetailVO> listByUserId(Long userId);

    java.util.List<ContentDetailVO> listAll();

}