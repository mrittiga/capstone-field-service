package com.meridian.capstone.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianAvailabilityCreateRequest {

    @NotNull(message = "Available date is required")
    private LocalDate availableDate;

    private LocalTime startTime;

    private LocalTime endTime;

    @NotNull(message = "Availability status is required")
    private Boolean isAvailable;

    private String notes;
}
