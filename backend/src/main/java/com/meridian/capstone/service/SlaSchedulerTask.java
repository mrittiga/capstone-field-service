package com.meridian.capstone.service;

import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SlaSchedulerTask {

    private final WorkOrderRepository workOrderRepository;
    private final NotificationService notificationService;
    private final SlaService slaService;

    @Scheduled(fixedDelay = 300000) // Every 5 minutes = 300000 milliseconds
    @Transactional
    public void checkSlaBreaches() {
        List<WorkOrder> overdueWorkOrders = workOrderRepository.findOverdueWorkOrders(LocalDateTime.now());

        for (WorkOrder workOrder : overdueWorkOrders) {
            String slaStatus = slaService.checkSlaStatus(workOrder);
            
            if ("breached".equals(slaStatus)) {
                // Find manager to notify
                // For now, notify assignee if exists
                if (workOrder.getAssignee() != null) {
                    notificationService.createNotification(
                        workOrder.getAssignee().getId(),
                        "SLA BREACHED: Work Order " + workOrder.getWorkOrderCode() + " has exceeded SLA due date",
                        "SLA_BREACH"
                    );
                }
            }
        }
    }
}
