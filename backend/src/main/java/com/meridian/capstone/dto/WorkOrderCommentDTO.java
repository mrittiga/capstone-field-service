package com.meridian.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderCommentDTO {

    private Long id;
    private Long workOrderId;
    private Long userId;
    private String userName;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
