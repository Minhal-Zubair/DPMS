package com.dpms.dpmsbackend.controller;

import com.dpms.dpmsbackend.dto.ProductDocumentDTO;
import com.dpms.dpmsbackend.entity.DocumentType;
import com.dpms.dpmsbackend.entity.Product;
import com.dpms.dpmsbackend.entity.ProductDocumentType;
import com.dpms.dpmsbackend.repository.DocumentTypeRepository;
import com.dpms.dpmsbackend.repository.ProductDocumentTypeRepository;
import com.dpms.dpmsbackend.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductRepository productRepository;
    private final ProductDocumentTypeRepository productDocumentTypeRepository;
    private final DocumentTypeRepository documentTypeRepository;

    public ProductController(
            ProductRepository productRepository,
            ProductDocumentTypeRepository productDocumentTypeRepository,
            DocumentTypeRepository documentTypeRepository
    ) {
        this.productRepository = productRepository;
        this.productDocumentTypeRepository = productDocumentTypeRepository;
        this.documentTypeRepository = documentTypeRepository;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findByActiveTrue();
    }

    @GetMapping("/{productId}/documents")
    public List<ProductDocumentDTO> getDocumentRequirements(
            @PathVariable Integer productId
    ) {
        List<ProductDocumentType> requirements =
                productDocumentTypeRepository.findByProductId(productId);

        List<ProductDocumentDTO> result = new ArrayList<>();

        for (ProductDocumentType req : requirements) {
            DocumentType docType = documentTypeRepository
                    .findById(req.getDocumentTypeId())
                    .orElse(null);

            if (docType == null) continue;

            ProductDocumentDTO dto = new ProductDocumentDTO();
            dto.setDocumentTypeId(req.getDocumentTypeId());
            dto.setDocumentName(docType.getName());
            dto.setIsRequired(req.getIsRequired());
            dto.setAllowedFormats(req.getAllowedFormats());
            dto.setMaxSizeMb(req.getMaxSizeMb());
            result.add(dto);
        }

        return result;
    }
}