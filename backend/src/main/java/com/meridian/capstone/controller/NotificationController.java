package com.meridian.capstone.controller;

import com.meridian.capstone.dto.NotificationDTO;
import com.meridian.capstone.repository.UserRepository;
import com.meridian.capstone.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080"})
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<NotificationDTO>> getNotifications(
            Authentication authentication,
            Pageable pageable) {
        log.info("GET /api/notifications - Fetching notifications");
        String userEmail = authentication.getName();
        var user = userRepository.findByEmail(userEmail);
        if (user.isPresent()) {
            Page<NotificationDTO> notifications = notificationService.getUserNotifications(user.get().getId(), pageable);
            return ResponseEntity.ok(notifications);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/unread")
    public ResponseEntity<Page<NotificationDTO>> getUnreadNotifications(
            Authentication authentication,
            Pageable pageable) {
        log.info("GET /api/notifications/unread");
        String userEmail = authentication.getName();
        var user = userRepository.findByEmail(userEmail);
        if (user.isPresent()) {
            Page<NotificationDTO> notifications = notificationService.getUnreadNotifications(user.get().getId(), pageable);
            return ResponseEntity.ok(notifications);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        log.info("GET /api/notifications/unread-count");
        String userEmail = authentication.getName();
        var user = userRepository.findByEmail(userEmail);
        if (user.isPresent()) {
            long count = notificationService.getUnreadCount(user.get().getId());
            return ResponseEntity.ok(count);
        }
        return ResponseEntity.ok(0L);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        log.info("PUT /api/notifications/{}/read", id);
        notificationService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        log.info("PUT /api/notifications/read-all");
        String userEmail = authentication.getName();
        var user = userRepository.findByEmail(userEmail);
        if (user.isPresent()) {
            notificationService.markAllAsRead(user.get().getId());
        }
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        log.info("DELETE /api/notifications/{}", id);
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/old-read")
    public ResponseEntity<Void> deleteOldReadNotifications(Authentication authentication) {
        log.info("DELETE /api/notifications/old-read");
        String userEmail = authentication.getName();
        var user = userRepository.findByEmail(userEmail);
        if (user.isPresent()) {
            notificationService.deleteOldReadNotifications(user.get().getId());
        }
        return ResponseEntity.noContent().build();
    }
}
