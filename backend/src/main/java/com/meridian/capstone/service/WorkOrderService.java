package com.meridian.capstone.service;

import com.meridian.capstone.domain.*;
import com.meridian.capstone.dto.WorkOrderCreateRequest;
import com.meridian.capstone.dto.WorkOrderDTO;
import com.meridian.capstone.exception.IllegalTransitionException;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.SiteRepository;
import com.meridian.capstone.repository.UserRepository;
import com.meridian.capstone.repository.WorkOrderRepository;
import com.meridian.capstone.repository.WorkOrderStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final WorkOrderStatusHistoryRepository historyRepository;
    private final SiteRepository siteRepository;
    private final UserRepository userRepository;
    private final SlaService slaService;

    @Transactional
    public WorkOrderDTO createWorkOrder(WorkOrderCreateRequest request, Long customerId) {
        Site site = siteRepository.findById(request.getSiteId())
            .orElseThrow(() -> new ResourceNotFoundException("Site not found with ID: " + request.getSiteId()));

        if (!site.getCustomer().getId().equals(customerId)) {
            throw new IllegalArgumentException("Site does not belong to this customer");
        }

        WorkOrder workOrder = new WorkOrder();
        workOrder.setWorkOrderCode(generateWorkOrderCode());
        workOrder.setSite(site);
        workOrder.setCustomer(site.getCustomer());
        workOrder.setTitle(request.getTitle());
        workOrder.setDescription(request.getDescription());
        workOrder.setPriority(request.getPriority());
        workOrder.setStatus(WorkOrderStatus.NEW);
        workOrder.setSlaDueDate(slaService.calculateSlaDueDate(request.getPriority()));

        WorkOrder savedWorkOrder = workOrderRepository.save(workOrder);
        return mapToDTO(savedWorkOrder);
    }

    @Transactional(readOnly = true)
    public WorkOrderDTO getWorkOrder(Long id) {
        WorkOrder workOrder = workOrderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + id));
        return mapToDTO(workOrder);
    }

    @Transactional(readOnly = true)
    public Page<WorkOrderDTO> getAllWorkOrders(Pageable pageable) {
        return workOrderRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<WorkOrderDTO> getWorkOrdersByStatus(WorkOrderStatus status, Pageable pageable) {
        return workOrderRepository.findByStatus(status, pageable).map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<WorkOrderDTO> getWorkOrdersByAssignee(Long technicianId, Pageable pageable) {
        return workOrderRepository.findByAssigneeId(technicianId, pageable).map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<WorkOrderDTO> getWorkOrdersByCustomer(Long customerId, Pageable pageable) {
        return workOrderRepository.findByCustomerId(customerId, pageable).map(this::mapToDTO);
    }

    @Transactional
    public WorkOrderDTO assignToTechnician(Long workOrderId, Long technicianId, Long changedById) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
            .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + workOrderId));

        User technician = userRepository.findById(technicianId)
            .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + technicianId));

        if (technician.getRole() != UserRole.TECHNICIAN) {
            throw new IllegalArgumentException("User is not a technician");
        }

        if (workOrder.getStatus() != WorkOrderStatus.NEW) {
            throw new IllegalTransitionException("Can only assign work orders in NEW status");
        }

        User changedBy = userRepository.findById(changedById)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + changedById));

        WorkOrderStatusHistory history = new WorkOrderStatusHistory();
        history.setWorkOrder(workOrder);
        history.setFromStatus(workOrder.getStatus());
        history.setToStatus(WorkOrderStatus.ASSIGNED);
        history.setChangedBy(changedBy);
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);

        workOrder.setStatus(WorkOrderStatus.ASSIGNED);
        workOrder.setAssignee(technician);

        WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);
        return mapToDTO(updatedWorkOrder);
    }

    @Transactional
    public WorkOrderDTO startWork(Long workOrderId, Long technicianId) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
            .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + workOrderId));

        if (workOrder.getStatus() != WorkOrderStatus.ASSIGNED) {
            throw new IllegalTransitionException("Can only start work from ASSIGNED status");
        }

        if (!workOrder.getAssignee().getId().equals(technicianId)) {
            throw new IllegalArgumentException("Work order is not assigned to this technician");
        }

        User technician = userRepository.findById(technicianId)
            .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + technicianId));

        WorkOrderStatusHistory history = new WorkOrderStatusHistory();
        history.setWorkOrder(workOrder);
        history.setFromStatus(workOrder.getStatus());
        history.setToStatus(WorkOrderStatus.IN_PROGRESS);
        history.setChangedBy(technician);
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);

        workOrder.setStatus(WorkOrderStatus.IN_PROGRESS);
        WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);
        return mapToDTO(updatedWorkOrder);
    }

    @Transactional
    public WorkOrderDTO holdWork(Long workOrderId, Long technicianId) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
            .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + workOrderId));

        if (workOrder.getStatus() != WorkOrderStatus.IN_PROGRESS) {
            throw new IllegalTransitionException("Can only hold work from IN_PROGRESS status");
        }

        if (!workOrder.getAssignee().getId().equals(technicianId)) {
            throw new IllegalArgumentException("Work order is not assigned to this technician");
        }

        User technician = userRepository.findById(technicianId)
            .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + technicianId));

        WorkOrderStatusHistory history = new WorkOrderStatusHistory();
        history.setWorkOrder(workOrder);
        history.setFromStatus(workOrder.getStatus());
        history.setToStatus(WorkOrderStatus.ON_HOLD);
        history.setChangedBy(technician);
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);

        workOrder.setStatus(WorkOrderStatus.ON_HOLD);
        WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);
        return mapToDTO(updatedWorkOrder);
    }

    @Transactional
    public WorkOrderDTO resumeWork(Long workOrderId, Long technicianId) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
            .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + workOrderId));

        if (workOrder.getStatus() != WorkOrderStatus.ON_HOLD) {
            throw new IllegalTransitionException("Can only resume work from ON_HOLD status");
        }

        if (!workOrder.getAssignee().getId().equals(technicianId)) {
            throw new IllegalArgumentException("Work order is not assigned to this technician");
        }

        User technician = userRepository.findById(technicianId)
            .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + technicianId));

        WorkOrderStatusHistory history = new WorkOrderStatusHistory();
        history.setWorkOrder(workOrder);
        history.setFromStatus(workOrder.getStatus());
        history.setToStatus(WorkOrderStatus.IN_PROGRESS);
        history.setChangedBy(technician);
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);

        workOrder.setStatus(WorkOrderStatus.IN_PROGRESS);
        WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);
        return mapToDTO(updatedWorkOrder);
    }

    @Transactional
    public WorkOrderDTO completeWork(Long workOrderId, Long technicianId) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
            .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + workOrderId));

        if (workOrder.getStatus() != WorkOrderStatus.IN_PROGRESS) {
            throw new IllegalTransitionException("Can only complete work from IN_PROGRESS status");
        }

        if (!workOrder.getAssignee().getId().equals(technicianId)) {
            throw new IllegalArgumentException("Work order is not assigned to this technician");
        }

        User technician = userRepository.findById(technicianId)
            .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + technicianId));

        WorkOrderStatusHistory history = new WorkOrderStatusHistory();
        history.setWorkOrder(workOrder);
        history.setFromStatus(workOrder.getStatus());
        history.setToStatus(WorkOrderStatus.COMPLETED);
        history.setChangedBy(technician);
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);

        workOrder.setStatus(WorkOrderStatus.COMPLETED);
        workOrder.setCompletedAt(LocalDateTime.now());
        WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);
        return mapToDTO(updatedWorkOrder);
    }

    @Transactional
    public WorkOrderDTO closeWorkOrder(Long workOrderId, Long userId) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
            .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + workOrderId));

        if (workOrder.getStatus() != WorkOrderStatus.COMPLETED) {
            throw new IllegalTransitionException("Can only close completed work orders");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        WorkOrderStatusHistory history = new WorkOrderStatusHistory();
        history.setWorkOrder(workOrder);
        history.setFromStatus(workOrder.getStatus());
        history.setToStatus(WorkOrderStatus.CLOSED);
        history.setChangedBy(user);
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);

        workOrder.setStatus(WorkOrderStatus.CLOSED);
        WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);
        return mapToDTO(updatedWorkOrder);
    }

    @Transactional
    public WorkOrderDTO cancelWorkOrder(Long workOrderId, Long userId) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
            .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + workOrderId));

        if (workOrder.getStatus() != WorkOrderStatus.NEW && workOrder.getStatus() != WorkOrderStatus.ASSIGNED) {
            throw new IllegalTransitionException("Can only cancel NEW or ASSIGNED work orders");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        WorkOrderStatusHistory history = new WorkOrderStatusHistory();
        history.setWorkOrder(workOrder);
        history.setFromStatus(workOrder.getStatus());
        history.setToStatus(WorkOrderStatus.CANCELLED);
        history.setChangedBy(user);
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);

        workOrder.setStatus(WorkOrderStatus.CANCELLED);
        WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);
        return mapToDTO(updatedWorkOrder);
    }

    private String generateWorkOrderCode() {
        String code;
        do {
            code = "WO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (workOrderRepository.existsByWorkOrderCode(code));
        return code;
    }

    private WorkOrderDTO mapToDTO(WorkOrder workOrder) {
        String slaStatus = slaService.checkSlaStatus(workOrder);
        
        return new WorkOrderDTO(
            workOrder.getId(),
            workOrder.getWorkOrderCode(),
            workOrder.getSite().getId(),
            workOrder.getSite().getName(),
            workOrder.getCustomer().getId(),
            workOrder.getCustomer().getName(),
            workOrder.getTitle(),
            workOrder.getDescription(),
            workOrder.getPriority(),
            workOrder.getStatus(),
            workOrder.getAssignee() != null ? workOrder.getAssignee().getId() : null,
            workOrder.getAssignee() != null ? workOrder.getAssignee().getName() : null,
            workOrder.getSlaDueDate(),
            slaStatus,
            workOrder.getTotalPartsCost(),
            workOrder.getTotalTimeMinutes(),
            workOrder.getCreatedAt(),
            workOrder.getUpdatedAt(),
            workOrder.getCompletedAt()
        );
    }
}
