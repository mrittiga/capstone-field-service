package com.meridian.capstone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequestCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Priority is required")
    private String priority; // HIGH, MEDIUM, LOW

    private Long siteId;

    private LocalDate requestedDate;

    private String preferredTimeWindow; // MORNING, AFTERNOON, EVENING, FLEXIBLE
}
