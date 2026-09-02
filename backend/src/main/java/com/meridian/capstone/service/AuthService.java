package com.meridian.capstone.service;

import com.meridian.capstone.domain.User;
import com.meridian.capstone.domain.UserRole;
import com.meridian.capstone.dto.LoginRequest;
import com.meridian.capstone.dto.LoginResponse;
import com.meridian.capstone.dto.RegisterRequest;
import com.meridian.capstone.repository.UserRepository;
import com.meridian.capstone.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest loginRequest) {
        log.info("Login attempt for email: {}", loginRequest.getEmail());

        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // Get user details
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate token
        String token = tokenProvider.generateToken(user.getEmail());

        log.info("Login successful for email: {}", loginRequest.getEmail());

        return new LoginResponse(
                token,
                user.getEmail(),
                user.getName(),
                user.getRole().toString(),
                user.getId()
        );
    }

    public LoginResponse register(RegisterRequest registerRequest) {
        log.info("Registration attempt for email: {}", registerRequest.getEmail());

        // Check if user already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setName(registerRequest.getName());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(UserRole.valueOf(registerRequest.getRole().toUpperCase()));

        userRepository.save(user);

        // Generate token
        String token = tokenProvider.generateToken(user.getEmail());

        log.info("Registration successful for email: {}", registerRequest.getEmail());

        return new LoginResponse(
                token,
                user.getEmail(),
                user.getName(),
                user.getRole().toString(),
                user.getId()
        );
    }
}
