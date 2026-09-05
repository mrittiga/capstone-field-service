package com.meridian.capstone.service;

import com.meridian.capstone.domain.TimeLog;
import com.meridian.capstone.domain.User;
import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.repository.TimeLogRepository;
import com.meridian.capstone.repository.UserRepository;
import com.meridian.capstone.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeLogService {

    private final TimeLogRepository timeLogRepository;
    private final WorkOrderRepository workOrderRepository;
    private final UserRepository userRepository;

    @Transactional
    public TimeLog logTime(Long workOrderId, Long technicianId, Integer minutesSpent, String note) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new RuntimeException("Work order not found"));

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TimeLog timeLog = new TimeLog();
        timeLog.setWorkOrder(workOrder);
        timeLog.setTechnician(technician);
        timeLog.setMinutesSpent(minutesSpent);
        timeLog.setNote(note);

        return timeLogRepository.save(timeLog);
    }

    public List<TimeLog> getTimeLogsByWorkOrder(Long workOrderId) {
        return timeLogRepository.findByWorkOrderId(workOrderId);
    }
}

