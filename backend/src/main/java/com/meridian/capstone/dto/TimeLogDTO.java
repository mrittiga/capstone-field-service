package com.meridian.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeLogDTO {

    private Long id;
    private Long userId;
    private String userName;
    private Long workOrderId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes;
    private String logType; // WORK_TIME, TRAVEL_TIME, BREAK, LUNCH
    private LocalDateTime createdAt;
}
