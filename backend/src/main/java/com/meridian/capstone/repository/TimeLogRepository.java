package com.meridian.capstone.repository;

import com.meridian.capstone.domain.TimeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {

    List<TimeLog> findByUserIdOrderByStartTimeDesc(Long userId);

    List<TimeLog> findByWorkOrderIdOrderByStartTimeDesc(Long workOrderId);

    @Query("SELECT t FROM TimeLog t WHERE t.user.id = :userId AND CAST(t.startTime AS date) = :date")
    List<TimeLog> findByUserIdAndDate(Long userId, LocalDate date);

    @Query("SELECT SUM(t.durationMinutes) FROM TimeLog t WHERE t.user.id = :userId AND t.startTime BETWEEN :startDate AND :endDate")
    Integer getTotalDurationMinutes(Long userId, LocalDateTime startDate, LocalDateTime endDate);

    List<TimeLog> findByUserIdAndLogType(Long userId, String logType);
}
