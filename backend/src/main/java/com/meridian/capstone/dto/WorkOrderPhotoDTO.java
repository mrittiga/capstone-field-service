package com.meridian.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderPhotoDTO {

    private Long id;
    private Long workOrderId;
    private String photoUrl;
    private String photoType; // BEFORE, AFTER, ISSUE, COMPLETION
    private Long uploadedById;
    private String uploadedByName;
    private LocalDateTime createdAt;
}
