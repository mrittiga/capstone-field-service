package com.meridian.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderDTO {

    private Long id;
    private Long siteId;
    private String siteName;
    private Long customerId;
    private String customerName;
    private String title;
    private String description;
    private String priority;
    private String status;
    private Long assigneeId;
    private String assigneeName;
    private LocalDateTime slaDueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
}
