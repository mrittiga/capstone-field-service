package com.meridian.capstone.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderPhotoCreateRequest {

    @NotBlank(message = "Photo URL is required")
    private String photoUrl;

    private String photoType; // BEFORE, AFTER, ISSUE, COMPLETION
}
