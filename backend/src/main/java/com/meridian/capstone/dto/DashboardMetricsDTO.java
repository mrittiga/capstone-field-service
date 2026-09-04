package com.meridian.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetricsDTO {

    private Long newCount;
    private Long assignedCount;
    private Long inProgressCount;
    private Long onHoldCount;
    private Long completedCount;
    private Long closedCount;
    private Long cancelledCount;
    private Long overdueCount;
    private Double slaCompliancePercentage;
}
