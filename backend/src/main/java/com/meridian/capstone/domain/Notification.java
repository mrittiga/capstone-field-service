package com.meridian.capstone.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type; // WORK_ORDER_UPDATE, ASSIGNMENT, SLA_ALERT, MESSAGE, SYSTEM_ALERT, REMINDER

    @Column(nullable = false)
    private String title;

    private String message;

    @Column(name = "is_read")
    private Boolean isRead = false;

    private String actionUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
