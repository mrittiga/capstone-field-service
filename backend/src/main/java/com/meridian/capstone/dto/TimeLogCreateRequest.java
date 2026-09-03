package com.meridian.capstone.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeLogCreateRequest {

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Long workOrderId;

    @NotNull(message = "Log type is required")
    private String logType; // WORK_TIME, TRAVEL_TIME, BREAK, LUNCH
}
