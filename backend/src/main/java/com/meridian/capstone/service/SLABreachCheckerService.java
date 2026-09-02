package com.meridian.capstone.service;

import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.domain.WorkOrderStatus;
import com.meridian.capstone.repository.WorkOrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class SLABreachCheckerService {

    @Autowired
    private WorkOrderRepository workOrderRepository;

    /**
     * Check for SLA breaches every 5 minutes
     * Runs at: 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 minutes of every hour
     */
    @Scheduled(fixedRate = 300000) // 5 minutes in milliseconds
    public void checkSLABreaches() {
        log.debug("Running SLA breach check...");

        // Get all active work orders (not completed or closed)
        List<WorkOrder> activeWorkOrders = workOrderRepository.findByStatus(WorkOrderStatus.ASSIGNED);
        activeWorkOrders.addAll(workOrderRepository.findByStatus(WorkOrderStatus.IN_PROGRESS));
        activeWorkOrders.addAll(workOrderRepository.findByStatus(WorkOrderStatus.ON_HOLD));

        LocalDateTime now = LocalDateTime.now();
        int breachCount = 0;

        for (WorkOrder workOrder : activeWorkOrders) {
            if (workOrder.getSlaDueDate() != null && now.isAfter(workOrder.getSlaDueDate())) {
                breachCount++;
                log.warn("SLA BREACH: Work Order ID {} - Title: {} - Due: {} - Now: {}",
                        workOrder.getId(),
                        workOrder.getTitle(),
                        workOrder.getSlaDueDate(),
                        now);
                
                // TODO: Send alert/notification
                // TODO: Mark work order with breach flag
            }
        }

        if (breachCount > 0) {
            log.warn("Found {} work orders with SLA breaches", breachCount);
        } else {
            log.debug("No SLA breaches found");
        }
    }

    /**
     * Get count of SLA breached work orders
     */
    public long getBreachedWorkOrderCount() {
        LocalDateTime now = LocalDateTime.now();

        List<WorkOrder> activeWorkOrders = workOrderRepository.findByStatus(WorkOrderStatus.ASSIGNED);
        activeWorkOrders.addAll(workOrderRepository.findByStatus(WorkOrderStatus.IN_PROGRESS));
        activeWorkOrders.addAll(workOrderRepository.findByStatus(WorkOrderStatus.ON_HOLD));

        return activeWorkOrders.stream()
                .filter(wo -> wo.getSlaDueDate() != null && now.isAfter(wo.getSlaDueDate()))
                .count();
    }
}
