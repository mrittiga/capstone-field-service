package com.meridian.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequestDTO {

    private Long id;
    private Long customerId;
    private String customerName;
    private String title;
    private String description;
    private String priority;
    private String status;
    private Long siteId;
    private String siteName;
    private Long assignedWorkOrderId;
    private LocalDate requestedDate;
    private String preferredTimeWindow;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
