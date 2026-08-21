package com.dpms.dpmsbackend.repository;

import com.dpms.dpmsbackend.entity.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentTypeRepository
        extends JpaRepository<DocumentType, Integer> {
}