package com.meridian.capstone.dto;

import com.meridian.capstone.domain.Priority;
import com.meridian.capstone.domain.WorkOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderDTO {

    private Long id;
    private String workOrderCode;
    private Long siteId;
    private String siteName;
    private Long customerId;
    private String customerName;
    private String title;
    private String description;
    private Priority priority;
    private WorkOrderStatus status;
    private Long assigneeId;
    private String assigneeName;
    private LocalDateTime slaDueDate;
    private String slaStatus;
    private BigDecimal totalPartsCost;
    private Long totalTimeMinutes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
}
