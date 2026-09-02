package com.meridian.capstone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderStatusTransitionRequest {

    @NotNull(message = "New status is required")
    private String newStatus;

    private String note;

    private Long assigneeId;
}
