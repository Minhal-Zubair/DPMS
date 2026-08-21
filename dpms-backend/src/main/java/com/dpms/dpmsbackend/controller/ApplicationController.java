package com.dpms.dpmsbackend.controller;

import com.dpms.dpmsbackend.dto.ApplicationRequest;
import com.dpms.dpmsbackend.dto.AdminApplicationDTO;
import com.dpms.dpmsbackend.dto.ApplicationStatusRequest;
import com.dpms.dpmsbackend.entity.Application;
import com.dpms.dpmsbackend.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dpms.dpmsbackend.dto.ApplicationDetailsDTO;
import java.util.List;
@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {
    private final ApplicationService service;
    public ApplicationController(ApplicationService service) {
        this.service = service;
    }
    @PostMapping
    public ResponseEntity<Application> create(
            @RequestBody ApplicationRequest request
    ) {

        // Temporary user id
        Application saved = service.createApplication(request, 6L);

        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<AdminApplicationDTO>> getAllApplications() {

        return ResponseEntity.ok(
                service.getAllApplications()
        );

    }
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDetailsDTO> getApplication(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getApplication(id)
        );

    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody ApplicationStatusRequest request
    ){
        service.updateStatus(id,
                request.getStatus());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Application> updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationRequest request
    ) {
        return ResponseEntity.ok(
                service.updateApplication(id, request)
        );
    }
    @GetMapping("/user/{id}")
    public ResponseEntity<List<Application>> getUserApps(
            @PathVariable Long id
    ){
        return ResponseEntity.ok(
                service.getUserApplications(id)
        );
    }
}