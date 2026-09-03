package com.meridian.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private Long id;
    private Long userId;
    private String type; // WORK_ORDER_UPDATE, ASSIGNMENT, SLA_ALERT, MESSAGE, SYSTEM_ALERT, REMINDER
    private String title;
    private String message;
    private Boolean isRead;
    private String actionUrl;
    private LocalDateTime createdAt;
}
