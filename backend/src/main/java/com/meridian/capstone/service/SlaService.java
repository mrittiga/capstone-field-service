package com.meridian.capstone.service;

import com.meridian.capstone.domain.Priority;
import com.meridian.capstone.domain.WorkOrder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SlaService {

    public LocalDateTime calculateSlaDueDate(Priority priority) {
        LocalDateTime now = LocalDateTime.now();
        
        return switch (priority) {
            case HIGH -> now.plusHours(4);
            case MEDIUM -> now.plusHours(24);
            case LOW -> now.plusHours(72);
        };
    }

    public String checkSlaStatus(WorkOrder workOrder) {
        if (workOrder.getSlaDueDate() == null) {
            return "unknown";
        }

        LocalDateTime now = LocalDateTime.now();

        if (workOrder.getStatus().toString().equals("CLOSED") || 
            workOrder.getStatus().toString().equals("CANCELLED")) {
            return "completed";
        }

        if (now.isAfter(workOrder.getSlaDueDate())) {
            return "breached";
        }

        LocalDateTime warningThreshold = workOrder.getSlaDueDate().minusHours(1);
        if (now.isAfter(warningThreshold)) {
            return "at_risk";
        }

        return "on_track";
    }
}
