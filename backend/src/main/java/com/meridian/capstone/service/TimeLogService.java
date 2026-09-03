package com.meridian.capstone.service;

import com.meridian.capstone.domain.TimeLog;
import com.meridian.capstone.domain.User;
import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.dto.TimeLogCreateRequest;
import com.meridian.capstone.dto.TimeLogDTO;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.TimeLogRepository;
import com.meridian.capstone.repository.UserRepository;
import com.meridian.capstone.repository.WorkOrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@Transactional
public class TimeLogService {

    @Autowired
    private TimeLogRepository timeLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    public TimeLogDTO createTimeLog(TimeLogCreateRequest request, String userEmail) {
        log.info("Creating time log for user: {} - Type: {}", userEmail, request.getLogType());

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        TimeLog timeLog = new TimeLog();
        timeLog.setUser(user);
        timeLog.setStartTime(request.getStartTime());
        timeLog.setEndTime(request.getEndTime());
        timeLog.setLogType(request.getLogType());
        timeLog.setCreatedAt(LocalDateTime.now());

        // Calculate duration if end time is provided
        if (request.getEndTime() != null) {
            long minutes = java.time.temporal.ChronoUnit.MINUTES.between(request.getStartTime(), request.getEndTime());
            timeLog.setDurationMinutes((int) minutes);
        }

        // Link to work order if provided
        if (request.getWorkOrderId() != null) {
            WorkOrder workOrder = workOrderRepository.findById(request.getWorkOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Work order not found: " + request.getWorkOrderId()));
            timeLog.setWorkOrder(workOrder);
        }

        TimeLog savedTimeLog = timeLogRepository.save(timeLog);
        log.info("Time log created successfully for user: {}", userEmail);

        return mapToDTO(savedTimeLog);
    }

    public TimeLogDTO endTimeLog(Long timeLogId) {
        log.info("Ending time log: {}", timeLogId);

        TimeLog timeLog = timeLogRepository.findById(timeLogId)
                .orElseThrow(() -> new ResourceNotFoundException("Time log not found: " + timeLogId));

        LocalDateTime endTime = LocalDateTime.now();
        timeLog.setEndTime(endTime);

        long minutes = java.time.temporal.ChronoUnit.MINUTES.between(timeLog.getStartTime(), endTime);
        timeLog.setDurationMinutes((int) minutes);

        TimeLog updated = timeLogRepository.save(timeLog);
        log.info("Time log ended successfully: {}", timeLogId);

        return mapToDTO(updated);
    }

    public List<TimeLogDTO> getUserTimeLogs(Long userId) {
        log.debug("Fetching time logs for user: {}", userId);

        List<TimeLog> timeLogs = timeLogRepository.findByUserIdOrderByStartTimeDesc(userId);
        return timeLogs.stream().map(this::mapToDTO).toList();
    }

    public List<TimeLogDTO> getUserTimeLogsForDate(Long userId, LocalDate date) {
        log.debug("Fetching time logs for user: {} on date: {}", userId, date);

        List<TimeLog> timeLogs = timeLogRepository.findByUserIdAndDate(userId, date);
        return timeLogs.stream().map(this::mapToDTO).toList();
    }

    public Integer getTotalWorkedMinutesForWeek(Long userId, LocalDate weekStart, LocalDate weekEnd) {
        log.debug("Getting total worked minutes for user: {} from {} to {}", userId, weekStart, weekEnd);

        LocalDateTime startDateTime = weekStart.atStartOfDay();
        LocalDateTime endDateTime = weekEnd.plusDays(1).atStartOfDay();

        Integer total = timeLogRepository.getTotalDurationMinutes(userId, startDateTime, endDateTime);
        return total != null ? total : 0;
    }

    public List<TimeLogDTO> getWorkOrderTimeLogs(Long workOrderId) {
        log.debug("Fetching time logs for work order: {}", workOrderId);

        List<TimeLog> timeLogs = timeLogRepository.findByWorkOrderIdOrderByStartTimeDesc(workOrderId);
        return timeLogs.stream().map(this::mapToDTO).toList();
    }

    private TimeLogDTO mapToDTO(TimeLog timeLog) {
        return new TimeLogDTO(
                timeLog.getId(),
                timeLog.getUser().getId(),
                timeLog.getUser().getName(),
                timeLog.getWorkOrder() != null ? timeLog.getWorkOrder().getId() : null,
                timeLog.getStartTime(),
                timeLog.getEndTime(),
                timeLog.getDurationMinutes(),
                timeLog.getLogType(),
                timeLog.getCreatedAt()
        );
    }
}
