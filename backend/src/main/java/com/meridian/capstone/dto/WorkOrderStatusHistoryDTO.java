package com.meridian.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderStatusHistoryDTO {

    private Long id;
    private Long workOrderId;
    private String fromStatus;
    private String toStatus;
    private Long changedById;
    private String changedByName;
    private LocalDateTime changedAt;
    private String note;
}
