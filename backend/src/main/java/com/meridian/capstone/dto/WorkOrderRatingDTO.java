package com.meridian.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderRatingDTO {

    private Long id;
    private Long workOrderId;
    private String workOrderTitle;
    private Long customerId;
    private String customerName;
    private Integer rating;
    private String reviewText;
    private LocalDateTime createdAt;
}
