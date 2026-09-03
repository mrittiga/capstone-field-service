package com.meridian.capstone.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderCommentCreateRequest {

    @NotBlank(message = "Comment message is required")
    private String message;
}
