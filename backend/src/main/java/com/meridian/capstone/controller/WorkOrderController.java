package com.meridian.capstone.controller;

import com.meridian.capstone.domain.WorkOrderStatusHistory;
import com.meridian.capstone.dto.WorkOrderCreateRequest;
import com.meridian.capstone.dto.WorkOrderDTO;
import com.meridian.capstone.dto.WorkOrderStatusTransitionRequest;
import com.meridian.capstone.domain.WorkOrderStatus;
import com.meridian.capstone.service.WorkOrderService;
import com.meridian.capstone.service.WorkOrderStatusTransitionService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/work-orders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080"})
public class WorkOrderController {

    @Autowired
    private WorkOrderService workOrderService;

    @Autowired
    private WorkOrderStatusTransitionService statusTransitionService;

    @PostMapping
    public ResponseEntity<WorkOrderDTO> createWorkOrder(@Valid @RequestBody WorkOrderCreateRequest request) {
        log.info("POST /api/work-orders - Creating work order: {}", request.getTitle());
        WorkOrderDTO response = workOrderService.createWorkOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<WorkOrderDTO>> getAllWorkOrders(Pageable pageable) {
        log.info("GET /api/work-orders - Fetching all work orders");
        Page<WorkOrderDTO> response = workOrderService.getAllWorkOrders(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkOrderDTO> getWorkOrderById(@PathVariable Long id) {
        log.info("GET /api/work-orders/{} - Fetching work order", id);
        WorkOrderDTO response = workOrderService.getWorkOrderById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<WorkOrderDTO>> getWorkOrdersByStatus(
            @PathVariable WorkOrderStatus status,
            Pageable pageable) {
        log.info("GET /api/work-orders/status/{} - Fetching work orders by status", status);
        Page<WorkOrderDTO> response = workOrderService.getWorkOrdersByStatus(status, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Page<WorkOrderDTO>> getWorkOrdersByCustomer(
            @PathVariable Long customerId,
            Pageable pageable) {
        log.info("GET /api/work-orders/customer/{} - Fetching work orders for customer", customerId);
        Page<WorkOrderDTO> response = workOrderService.getWorkOrdersByCustomer(customerId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<WorkOrderDTO>> searchWorkOrders(
            @RequestParam String searchTerm,
            Pageable pageable) {
        log.info("GET /api/work-orders/search - Searching with term: {}", searchTerm);
        Page<WorkOrderDTO> response = workOrderService.searchWorkOrders(searchTerm, pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkOrderDTO> updateWorkOrder(
            @PathVariable Long id,
            @Valid @RequestBody WorkOrderCreateRequest request) {
        log.info("PUT /api/work-orders/{} - Updating work order", id);
        WorkOrderDTO response = workOrderService.updateWorkOrder(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkOrder(@PathVariable Long id) {
        log.info("DELETE /api/work-orders/{} - Deleting work order", id);
        workOrderService.deleteWorkOrder(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/transition")
    public ResponseEntity<WorkOrderDTO> transitionStatus(
            @PathVariable Long id,
            @Valid @RequestBody WorkOrderStatusTransitionRequest request,
            Authentication authentication) {
        log.info("POST /api/work-orders/{}/transition - Transitioning to status: {}", id, request.getNewStatus());
        String currentUserEmail = authentication.getName();
        WorkOrderDTO response = statusTransitionService.transitionStatus(id, request, currentUserEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<WorkOrderStatusHistory>> getStatusHistory(@PathVariable Long id) {
        log.info("GET /api/work-orders/{}/history - Fetching status history", id);
        List<WorkOrderStatusHistory> response = statusTransitionService.getStatusHistory(id);
        return ResponseEntity.ok(response);
    }
}
