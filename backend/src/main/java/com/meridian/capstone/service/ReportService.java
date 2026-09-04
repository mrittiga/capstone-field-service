package com.meridian.capstone.service;

import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.domain.WorkOrderStatus;
import com.meridian.capstone.dto.DashboardMetricsDTO;
import com.meridian.capstone.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final WorkOrderRepository workOrderRepository;

    @Transactional(readOnly = true)
    public DashboardMetricsDTO getDashboardMetrics() {
        long newCount = workOrderRepository.countByStatus(WorkOrderStatus.NEW);
        long assignedCount = workOrderRepository.countByStatus(WorkOrderStatus.ASSIGNED);
        long inProgressCount = workOrderRepository.countByStatus(WorkOrderStatus.IN_PROGRESS);
        long onHoldCount = workOrderRepository.countByStatus(WorkOrderStatus.ON_HOLD);
        long completedCount = workOrderRepository.countByStatus(WorkOrderStatus.COMPLETED);
        long closedCount = workOrderRepository.countByStatus(WorkOrderStatus.CLOSED);
        long cancelledCount = workOrderRepository.countByStatus(WorkOrderStatus.CANCELLED);

        List<WorkOrder> overdueWorkOrders = workOrderRepository.findOverdueWorkOrders(LocalDateTime.now());
        long overdueCount = overdueWorkOrders.size();

        long totalWorkOrders = newCount + assignedCount + inProgressCount + onHoldCount + 
                              completedCount + closedCount + cancelledCount;

        double slaCompliancePercentage = 0.0;
        if (totalWorkOrders > 0) {
            long breachedCount = overdueCount;
            slaCompliancePercentage = ((totalWorkOrders - breachedCount) * 100.0) / totalWorkOrders;
        }

        return new DashboardMetricsDTO(
            newCount,
            assignedCount,
            inProgressCount,
            onHoldCount,
            completedCount,
            closedCount,
            cancelledCount,
            overdueCount,
            slaCompliancePercentage
        );
    }

    @Transactional(readOnly = true)
    public List<WorkOrder> getOverdueWorkOrders() {
        return workOrderRepository.findOverdueWorkOrders(LocalDateTime.now());
    }
}
