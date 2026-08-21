package com.dpms.dpmsbackend.controller;
import com.dpms.dpmsbackend.dto.ReportSummaryDTO;
import com.dpms.dpmsbackend.service.ReportService;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/reports")
@CrossOrigin(
        origins="http://localhost:5173"
)
public class ReportController {
    private final ReportService reportService;
    public ReportController(
            ReportService reportService
    ){
        this.reportService=reportService;
    }
    @GetMapping
    public ReportSummaryDTO getSummary() {
        return reportService.getSummary();
    }
}