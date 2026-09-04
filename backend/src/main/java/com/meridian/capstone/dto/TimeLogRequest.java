package com.meridian.capstone.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeLogRequest {

    @NotNull(message = "Minutes spent is required")
    @Positive(message = "Minutes must be positive")
    private Long minutesSpent;

    private String note;
}
