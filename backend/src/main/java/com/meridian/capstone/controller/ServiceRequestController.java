package com.meridian.capstone.controller;

import com.meridian.capstone.dto.ServiceRequestCreateRequest;
import com.meridian.capstone.dto.ServiceRequestDTO;
import com.meridian.capstone.repository.CustomerRepository;
import com.meridian.capstone.service.ServiceRequestService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/service-requests")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080"})
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping
    public ResponseEntity<ServiceRequestDTO> createServiceRequest(
            @Valid @RequestBody ServiceRequestCreateRequest request,
            Authentication authentication) {
        log.info("POST /api/service-requests - Creating service request");
        // For now, use a default customer ID (1)
        ServiceRequestDTO response = serviceRequestService.createServiceRequest(request, 1L);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ServiceRequestDTO>> getRequestsByStatus(
            @RequestParam(defaultValue = "OPEN") String status,
            Pageable pageable) {
        log.info("GET /api/service-requests - Fetching service requests with status: {}", status);
        Page<ServiceRequestDTO> response = serviceRequestService.getRequestsByStatus(status, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequestDTO> getServiceRequest(@PathVariable Long id) {
        log.info("GET /api/service-requests/{} - Fetching service request", id);
        ServiceRequestDTO response = serviceRequestService.getServiceRequest(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ServiceRequestDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        log.info("PUT /api/service-requests/{}/status - Updating status to: {}", id, status);
        ServiceRequestDTO response = serviceRequestService.updateStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer/my-requests")
    public ResponseEntity<Page<ServiceRequestDTO>> getMyRequests(
            Authentication authentication,
            Pageable pageable) {
        log.info("GET /api/service-requests/customer/my-requests - Fetching my service requests");
        // Default to customer ID 1
        Page<ServiceRequestDTO> response = serviceRequestService.getCustomerRequests(1L, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending-count")
    public ResponseEntity<Long> getPendingCount() {
        log.info("GET /api/service-requests/pending-count - Getting pending request count");
        long count = serviceRequestService.getPendingRequestCount();
        return ResponseEntity.ok(count);
    }
}
