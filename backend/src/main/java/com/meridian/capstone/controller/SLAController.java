package com.meridian.capstone.controller;

import com.meridian.capstone.dto.SLADashboardDTO;
import com.meridian.capstone.service.SLADashboardService;
import com.meridian.capstone.service.SLABreachCheckerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/sla")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080"})
public class SLAController {

    @Autowired
    private SLADashboardService slaService;

    @Autowired
    private SLABreachCheckerService breachCheckerService;

    @GetMapping("/dashboard")
    public ResponseEntity<SLADashboardDTO> getSLADashboard() {
        log.info("GET /api/sla/dashboard - Fetching SLA dashboard");
        SLADashboardDTO response = slaService.getSLADashboard();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/breached-count")
    public ResponseEntity<Long> getBreachedCount() {
        log.info("GET /api/sla/breached-count - Fetching breached work order count");
        long count = breachCheckerService.getBreachedWorkOrderCount();
        return ResponseEntity.ok(count);
    }

    @PostMapping("/check")
    public ResponseEntity<String> triggerSLACheck() {
        log.info("POST /api/sla/check - Triggering manual SLA breach check");
        breachCheckerService.checkSLABreaches();
        return ResponseEntity.ok("SLA breach check completed");
    }
}
