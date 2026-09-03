package com.meridian.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartsUsedDTO {

    private Long id;
    private Long workOrderId;
    private Long partId;
    private String partName;
    private Integer quantity;
    private LocalDateTime usedAt;
    private Long addedById;
    private String addedByName;
}
