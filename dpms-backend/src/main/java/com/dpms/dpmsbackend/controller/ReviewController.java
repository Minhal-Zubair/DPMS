package com.dpms.dpmsbackend.controller;

import com.dpms.dpmsbackend.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/review")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/applications/{id}/risk")
    public ResponseEntity<Map<String, Object>> getRisk(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.calculateRisk(id));
    }

    @PutMapping("/applications/{id}/notes")
    public ResponseEntity<?> saveNotes(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        reviewService.saveReviewerNotes(id, body.get("notes"));
        return ResponseEntity.ok("Notes saved");
    }

    @PostMapping("/applications/{id}/request-correction")
    public ResponseEntity<?> requestCorrection(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        reviewService.requestCorrection(id, body.get("instructions"));
        return ResponseEntity.ok("Correction requested");
    }
}