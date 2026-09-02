package com.meridian.capstone.controller;

import com.meridian.capstone.dto.SiteCreateRequest;
import com.meridian.capstone.dto.SiteDTO;
import com.meridian.capstone.service.SiteService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/sites")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080"})
public class SiteController {

    @Autowired
    private SiteService siteService;

    @PostMapping
    public ResponseEntity<SiteDTO> createSite(@Valid @RequestBody SiteCreateRequest request) {
        log.info("POST /api/sites - Creating site: {}", request.getName());
        SiteDTO response = siteService.createSite(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<SiteDTO>> getAllSites(Pageable pageable) {
        log.info("GET /api/sites - Fetching all sites");
        Page<SiteDTO> response = siteService.getAllSites(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SiteDTO> getSiteById(@PathVariable Long id) {
        log.info("GET /api/sites/{} - Fetching site", id);
        SiteDTO response = siteService.getSiteById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Page<SiteDTO>> getSitesByCustomer(
            @PathVariable Long customerId,
            Pageable pageable) {
        log.info("GET /api/sites/customer/{} - Fetching sites for customer", customerId);
        Page<SiteDTO> response = siteService.getSitesByCustomer(customerId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<SiteDTO>> searchSites(
            @RequestParam String searchTerm,
            Pageable pageable) {
        log.info("GET /api/sites/search - Searching with term: {}", searchTerm);
        Page<SiteDTO> response = siteService.searchSites(searchTerm, pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SiteDTO> updateSite(
            @PathVariable Long id,
            @Valid @RequestBody SiteCreateRequest request) {
        log.info("PUT /api/sites/{} - Updating site", id);
        SiteDTO response = siteService.updateSite(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSite(@PathVariable Long id) {
        log.info("DELETE /api/sites/{} - Deleting site", id);
        siteService.deleteSite(id);
        return ResponseEntity.noContent().build();
    }
}
