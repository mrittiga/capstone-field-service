package com.meridian.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SLADashboardDTO {

    private long totalActiveWorkOrders;
    private long breachedWorkOrders;
    private long onTrackWorkOrders;
    private double breachPercentage;
    private String status; // GREEN, YELLOW, RED
}
