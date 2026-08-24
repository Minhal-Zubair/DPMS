package com.dpms.dpmsbackend.repository;

import com.dpms.dpmsbackend.entity.DocumentExtraction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DocumentExtractionRepository
        extends JpaRepository<DocumentExtraction, Long> {

    Optional<DocumentExtraction> findByDocumentId(Long documentId);
    List<DocumentExtraction> findByApplicationId(Long applicationId);
}