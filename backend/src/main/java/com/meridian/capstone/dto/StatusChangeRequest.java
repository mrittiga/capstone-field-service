package com.meridian.capstone.dto;

import com.meridian.capstone.domain.WorkOrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusChangeRequest {

    @NotNull(message = "Status is required")
    private WorkOrderStatus status;

    private String note;
}
