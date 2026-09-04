package com.meridian.capstone.dto;

import com.meridian.capstone.domain.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private Long id;
    private String email;
    private String name;
    private UserRole role;
    private String token;
}
