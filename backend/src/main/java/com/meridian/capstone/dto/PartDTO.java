package com.meridian.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartDTO {

    private Long id;
    private String name;
    private String sku;
    private BigDecimal unitCost;
    private Integer currentStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
