package com.meridian.capstone.service;

import com.meridian.capstone.domain.*;
import com.meridian.capstone.dto.WorkOrderCreateRequest;
import com.meridian.capstone.dto.WorkOrderDTO;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.CustomerRepository;
import com.meridian.capstone.repository.SiteRepository;
import com.meridian.capstone.repository.WorkOrderRepository;
import com.meridian.capstone.repository.WorkOrderStatusHistoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@Transactional
public class WorkOrderService {

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private SiteRepository siteRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private WorkOrderStatusHistoryRepository statusHistoryRepository;

    public WorkOrderDTO createWorkOrder(WorkOrderCreateRequest request) {
        log.info("Creating work order: {} for customer: {}", request.getTitle(), request.getCustomerId());

        Site site = siteRepository.findById(request.getSiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Site not found with ID: " + request.getSiteId()));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));

        WorkOrder workOrder = new WorkOrder();
        workOrder.setSite(site);
        workOrder.setCustomer(customer);
        workOrder.setTitle(request.getTitle());
        workOrder.setDescription(request.getDescription());
        workOrder.setPriority(Priority.valueOf(request.getPriority().toUpperCase()));
        workOrder.setStatus(WorkOrderStatus.NEW);

        WorkOrder savedWorkOrder = workOrderRepository.save(workOrder);
        log.info("Work order created with ID: {}", savedWorkOrder.getId());

        return mapToDTO(savedWorkOrder);
    }

    public WorkOrderDTO getWorkOrderById(Long id) {
        log.debug("Fetching work order with ID: {}", id);

        WorkOrder workOrder = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + id));

        return mapToDTO(workOrder);
    }

    public Page<WorkOrderDTO> getAllWorkOrders(Pageable pageable) {
        log.debug("Fetching all work orders with pagination");

        return workOrderRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    public Page<WorkOrderDTO> getWorkOrdersByStatus(WorkOrderStatus status, Pageable pageable) {
        log.debug("Fetching work orders with status: {}", status);

        return workOrderRepository.findByStatusPaginated(status, pageable)
                .map(this::mapToDTO);
    }

    public Page<WorkOrderDTO> getWorkOrdersByCustomer(Long customerId, Pageable pageable) {
        log.debug("Fetching work orders for customer: {}", customerId);

        customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        return workOrderRepository.findByCustomerId(customerId, pageable)
                .map(this::mapToDTO);
    }

    public Page<WorkOrderDTO> searchWorkOrders(String searchTerm, Pageable pageable) {
        log.debug("Searching work orders with term: {}", searchTerm);

        return workOrderRepository.searchWorkOrders(searchTerm, pageable)
                .map(this::mapToDTO);
    }

    public WorkOrderDTO updateWorkOrder(Long id, WorkOrderCreateRequest request) {
        log.info("Updating work order with ID: {}", id);

        WorkOrder workOrder = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + id));

        if (workOrder.getStatus() == WorkOrderStatus.CLOSED || workOrder.getStatus() == WorkOrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot update closed or cancelled work orders");
        }

        workOrder.setTitle(request.getTitle());
        workOrder.setDescription(request.getDescription());
        workOrder.setPriority(Priority.valueOf(request.getPriority().toUpperCase()));

        WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);
        log.info("Work order updated with ID: {}", id);

        return mapToDTO(updatedWorkOrder);
    }

    public void deleteWorkOrder(Long id) {
        log.info("Deleting work order with ID: {}", id);

        WorkOrder workOrder = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + id));

        workOrderRepository.delete(workOrder);
        log.info("Work order deleted with ID: {}", id);
    }

    private WorkOrderDTO mapToDTO(WorkOrder workOrder) {
        return new WorkOrderDTO(
                workOrder.getId(),
                workOrder.getSite().getId(),
                workOrder.getSite().getName(),
                workOrder.getCustomer().getId(),
                workOrder.getCustomer().getName(),
                workOrder.getTitle(),
                workOrder.getDescription(),
                workOrder.getPriority().toString(),
                workOrder.getStatus().toString(),
                workOrder.getAssignee() != null ? workOrder.getAssignee().getId() : null,
                workOrder.getAssignee() != null ? workOrder.getAssignee().getName() : null,
                workOrder.getSlaDueDate(),
                workOrder.getCreatedAt(),
                workOrder.getUpdatedAt(),
                workOrder.getCompletedAt()
        );
    }
}
