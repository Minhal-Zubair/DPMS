package com.dpms.dpmsbackend.controller;

import com.dpms.dpmsbackend.dto.SLAApplicationDTO;
import com.dpms.dpmsbackend.dto.SLAStatsDTO;
import com.dpms.dpmsbackend.service.SLAService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sla")
@CrossOrigin(origins = "http://localhost:5173")
public class SLAController {

    private final SLAService slaService;

    public SLAController(SLAService slaService) {
        this.slaService = slaService;
    }

    @GetMapping("/stats")
    public ResponseEntity<SLAStatsDTO> getStats() {
        return ResponseEntity.ok(slaService.getStats());
    }

    @GetMapping("/applications")
    public ResponseEntity<List<SLAApplicationDTO>> getAllApplications() {
        return ResponseEntity.ok(slaService.getAllSLAApplications());
    }

    @PutMapping("/applications/{id}/set")
    public ResponseEntity<?> setSLA(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body
    ) {
        Integer days = body.get("slaDays");
        if (days == null || days < 1) {
            return ResponseEntity.badRequest().body("slaDays must be >= 1");
        }
        slaService.setSLA(id, days);
        return ResponseEntity.ok("SLA set to " + days + " days");
    }
}