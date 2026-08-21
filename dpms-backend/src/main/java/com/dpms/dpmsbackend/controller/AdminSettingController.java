package com.dpms.dpmsbackend.controller;

import com.dpms.dpmsbackend.dto.AdminSettingDTO;
import com.dpms.dpmsbackend.dto.AdminSettingRequest;
import com.dpms.dpmsbackend.service.AdminSettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminSettingController {

    private final AdminSettingService service;

    public AdminSettingController(
            AdminSettingService service
    ) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<AdminSettingDTO> getSettings() {

        return ResponseEntity.ok(
                service.getSettings()
        );

    }

    @PutMapping
    public ResponseEntity<AdminSettingDTO> updateSettings(
            @RequestBody AdminSettingRequest request
    ) {

        return ResponseEntity.ok(
                service.updateSettings(request)
        );

    }

}