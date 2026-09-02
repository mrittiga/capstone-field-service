package com.meridian.capstone.service;

import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.domain.WorkOrderStatus;
import com.meridian.capstone.dto.SLADashboardDTO;
import com.meridian.capstone.repository.WorkOrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class SLADashboardService {

    @Autowired
    private WorkOrderRepository workOrderRepository;

    public SLADashboardDTO getSLADashboard() {
        log.debug("Generating SLA dashboard");

        // Get all active work orders
        List<WorkOrder> activeWorkOrders = workOrderRepository.findByStatus(WorkOrderStatus.ASSIGNED);
        activeWorkOrders.addAll(workOrderRepository.findByStatus(WorkOrderStatus.IN_PROGRESS));
        activeWorkOrders.addAll(workOrderRepository.findByStatus(WorkOrderStatus.ON_HOLD));

        long totalActive = activeWorkOrders.size();

        // Count breached work orders
        LocalDateTime now = LocalDateTime.now();
        long breached = activeWorkOrders.stream()
                .filter(wo -> wo.getSlaDueDate() != null && now.isAfter(wo.getSlaDueDate()))
                .count();

        long onTrack = totalActive - breached;

        // Calculate percentage
        double breachPercentage = totalActive > 0 ? (breached * 100.0) / totalActive : 0;

        // Determine status
        String status;
        if (breachPercentage == 0) {
            status = "GREEN"; // All on track
        } else if (breachPercentage < 10) {
            status = "YELLOW"; // Some breaches
        } else {
            status = "RED"; // Many breaches
        }

        log.info("SLA Dashboard: Total={}, Breached={}, OnTrack={}, Percentage={}%, Status={}",
                totalActive, breached, onTrack, String.format("%.2f", breachPercentage), status);

        return new SLADashboardDTO(totalActive, breached, onTrack, breachPercentage, status);
    }
}
