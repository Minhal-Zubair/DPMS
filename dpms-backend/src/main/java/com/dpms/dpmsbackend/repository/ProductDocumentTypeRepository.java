package com.dpms.dpmsbackend.repository;

import com.dpms.dpmsbackend.entity.ProductDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductDocumentTypeRepository
        extends JpaRepository<ProductDocumentType, Long> {
    List<ProductDocumentType> findByProductId(Integer productId);
}