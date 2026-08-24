package com.dpms.dpmsbackend.controller;

import com.dpms.dpmsbackend.dto.ExtractionResultDTO;
import com.dpms.dpmsbackend.entity.DocumentExtraction;
import com.dpms.dpmsbackend.repository.DocumentExtractionRepository;
import com.dpms.dpmsbackend.service.DocumentAIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:5173")
public class DocumentAIController {

    private final DocumentAIService aiService;
    private final DocumentExtractionRepository extractionRepository;

    public DocumentAIController(
            DocumentAIService aiService,
            DocumentExtractionRepository extractionRepository
    ) {
        this.aiService = aiService;
        this.extractionRepository = extractionRepository;
    }

    // Trigger AI analysis on a specific document
    @PostMapping("/{documentId}/analyze")
    public ResponseEntity<ExtractionResultDTO> analyzeDocument(
            @PathVariable Long documentId
    ) {
        ExtractionResultDTO result = aiService.analyzeDocument(documentId);
        return ResponseEntity.ok(result);
    }

    // Get extraction results for all documents of an application
    @GetMapping("/application/{applicationId}/extractions")
    public ResponseEntity<List<DocumentExtraction>> getExtractions(
            @PathVariable Long applicationId
    ) {
        return ResponseEntity.ok(
                extractionRepository.findByApplicationId(applicationId)
        );
    }
}