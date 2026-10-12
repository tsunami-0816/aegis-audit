package com.aegis.audit.service;

import com.aegis.audit.dto.SubmitContentDTO;
import com.aegis.audit.entity.ContentRecord;
import com.aegis.audit.vo.ContentDetailVO;
import com.baomidou.mybatisplus.extension.service.IService;

public interface ContentRecordService extends IService<ContentRecord> {

    ContentRecord submitContent(Long userId, SubmitContentDTO dto);

    ContentDetailVO getContentDetail(Long id);

    java.util.List<ContentDetailVO> listByUserId(Long userId);

    java.util.List<ContentDetailVO> listAll();

}