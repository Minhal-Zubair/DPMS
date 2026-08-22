package com.dpms.dpmsbackend.repository;


import com.dpms.dpmsbackend.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;


public interface DocumentRepository
        extends JpaRepository<Document,Long>{


    List<Document> findByApplicationId(Long applicationId);

    boolean existsByApplicationIdAndFileHash(Long applicationId, String fileHash);

    boolean existsByApplicationIdAndDocumentTypeId(Long applicationId, Integer documentTypeId);


}