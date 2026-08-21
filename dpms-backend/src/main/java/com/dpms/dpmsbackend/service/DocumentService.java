package com.dpms.dpmsbackend.service;


import com.dpms.dpmsbackend.entity.Document;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface DocumentService {

    Document getDocument(Long id);


    void uploadDocument(
            Long applicationId,
            Long userId,
            Integer documentTypeId,
            MultipartFile file
    );


    List<?> getDocuments(Long applicationId);


}