package com.meridian.capstone.service;

import com.meridian.capstone.domain.User;
import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.domain.WorkOrderStatus;
import com.meridian.capstone.domain.WorkOrderStatusHistory;
import com.meridian.capstone.dto.WorkOrderDTO;
import com.meridian.capstone.dto.WorkOrderStatusTransitionRequest;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.UserRepository;
import com.meridian.capstone.repository.WorkOrderRepository;
import com.meridian.capstone.repository.WorkOrderStatusHistoryRepository;
import com.meridian.capstone.util.SLAConstants;
import com.meridian.capstone.util.StateTransitionValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@Transactional
public class WorkOrderStatusTransitionService {

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private WorkOrderStatusHistoryRepository statusHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    public WorkOrderDTO transitionStatus(Long workOrderId, WorkOrderStatusTransitionRequest request, String currentUserEmail) {
        log.info("Transitioning work order {} to status: {}", workOrderId, request.getNewStatus());

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + workOrderId));

        WorkOrderStatus newStatus = WorkOrderStatus.valueOf(request.getNewStatus().toUpperCase());

        // Validate transition
        StateTransitionValidator.validateTransition(workOrder.getStatus(), newStatus);

        // Get current user
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserEmail));

        // Handle assignee if provided
        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found with ID: " + request.getAssigneeId()));
            workOrder.setAssignee(assignee);
        }

        // Record status history
        WorkOrderStatusHistory history = new WorkOrderStatusHistory();
        history.setWorkOrder(workOrder);
        history.setFromStatus(workOrder.getStatus());
        history.setToStatus(newStatus);
        history.setChangedBy(currentUser);
        history.setNote(request.getNote());
        statusHistoryRepository.save(history);

        // Update work order status
        WorkOrderStatus oldStatus = workOrder.getStatus();
        workOrder.setStatus(newStatus);

        // Set SLA due date if transitioning to ASSIGNED
        if (newStatus == WorkOrderStatus.ASSIGNED && oldStatus == WorkOrderStatus.NEW) {
            int slaMinutes = SLAConstants.getSLAMinutes(workOrder.getPriority());
            workOrder.setSlaDueDate(LocalDateTime.now().plusMinutes(slaMinutes));
            log.info("SLA set for work order {} - {} minutes", workOrderId, slaMinutes);
        }

        // Set completed date if transitioning to COMPLETED
        if (newStatus == WorkOrderStatus.COMPLETED) {
            workOrder.setCompletedAt(LocalDateTime.now());
            log.info("Work order {} marked as completed", workOrderId);
        }

        WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);
        log.info("Work order {} transitioned from {} to {}", workOrderId, oldStatus, newStatus);

        return mapToDTO(updatedWorkOrder);
    }

    public List<WorkOrderStatusHistory> getStatusHistory(Long workOrderId) {
        log.debug("Fetching status history for work order: {}", workOrderId);

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + workOrderId));

        return statusHistoryRepository.findByWorkOrderIdOrderByChangedAtDesc(workOrderId);
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
