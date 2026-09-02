package com.meridian.capstone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderCreateRequest {

    @NotNull(message = "Site ID is required")
    private Long siteId;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Priority is required")
    private String priority;
}
