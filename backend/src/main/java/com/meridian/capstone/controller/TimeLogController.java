package com.meridian.capstone.controller;

import com.meridian.capstone.dto.TimeLogCreateRequest;
import com.meridian.capstone.dto.TimeLogDTO;
import com.meridian.capstone.repository.UserRepository;
import com.meridian.capstone.service.TimeLogService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/time-logs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080"})
public class TimeLogController {

    @Autowired
    private TimeLogService timeLogService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<TimeLogDTO> createTimeLog(
            @Valid @RequestBody TimeLogCreateRequest request,
            Authentication authentication) {
        log.info("POST /api/time-logs");
        String userEmail = authentication.getName();
        TimeLogDTO response = timeLogService.createTimeLog(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TimeLogDTO>> getUserTimeLogs(Authentication authentication) {
        log.info("GET /api/time-logs");
        String userEmail = authentication.getName();
        var user = userRepository.findByEmail(userEmail);
        if (user.isPresent()) {
            List<TimeLogDTO> timeLogs = timeLogService.getUserTimeLogs(user.get().getId());
            return ResponseEntity.ok(timeLogs);
        }
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<TimeLogDTO>> getUserTimeLogsForDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication authentication) {
        log.info("GET /api/time-logs/date/{}", date);
        String userEmail = authentication.getName();
        var user = userRepository.findByEmail(userEmail);
        if (user.isPresent()) {
            List<TimeLogDTO> timeLogs = timeLogService.getUserTimeLogsForDate(user.get().getId(), date);
            return ResponseEntity.ok(timeLogs);
        }
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/work-order/{workOrderId}")
    public ResponseEntity<List<TimeLogDTO>> getWorkOrderTimeLogs(@PathVariable Long workOrderId) {
        log.info("GET /api/time-logs/work-order/{}", workOrderId);
        List<TimeLogDTO> response = timeLogService.getWorkOrderTimeLogs(workOrderId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/end")
    public ResponseEntity<TimeLogDTO> endTimeLog(@PathVariable Long id) {
        log.info("PUT /api/time-logs/{}/end", id);
        TimeLogDTO response = timeLogService.endTimeLog(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/week-summary")
    public ResponseEntity<Integer> getWeeklyHours(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekEnd,
            Authentication authentication) {
        log.info("GET /api/time-logs/week-summary");
        String userEmail = authentication.getName();
        var user = userRepository.findByEmail(userEmail);
        if (user.isPresent()) {
            Integer hours = timeLogService.getTotalWorkedMinutesForWeek(user.get().getId(), weekStart, weekEnd);
            return ResponseEntity.ok(hours);
        }
        return ResponseEntity.ok(0);
    }
}
