package com.meridian.capstone.service;

import com.meridian.capstone.domain.TimeLog;
import com.meridian.capstone.domain.User;
import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.dto.TimeLogRequest;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.TimeLogRepository;
import com.meridian.capstone.repository.UserRepository;
import com.meridian.capstone.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeLogService {

    private final TimeLogRepository timeLogRepository;
    private final WorkOrderRepository workOrderRepository;
    private final UserRepository userRepository;

    @Transactional
    public void logTime(Long workOrderId, Long technicianId, TimeLogRequest request) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
            .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + workOrderId));

        User technician = userRepository.findById(technicianId)
            .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + technicianId));

        TimeLog timeLog = new TimeLog();
        timeLog.setWorkOrder(workOrder);
        timeLog.setTechnician(technician);
        timeLog.setMinutesSpent(request.getMinutesSpent());
        timeLog.setNote(request.getNote());
        timeLog.setLoggedAt(LocalDateTime.now());
        timeLogRepository.save(timeLog);

        // Update work order total time
        workOrder.setTotalTimeMinutes(workOrder.getTotalTimeMinutes() + request.getMinutesSpent());
        workOrderRepository.save(workOrder);
    }

    @Transactional(readOnly = true)
    public List<TimeLog> getTimeLogByWorkOrder(Long workOrderId) {
        if (!workOrderRepository.existsById(workOrderId)) {
            throw new ResourceNotFoundException("Work order not found with ID: " + workOrderId);
        }
        return timeLogRepository.findByWorkOrderId(workOrderId);
    }

    @Transactional(readOnly = true)
    public List<TimeLog> getTimeLogByTechnician(Long technicianId) {
        if (!userRepository.existsById(technicianId)) {
            throw new ResourceNotFoundException("Technician not found with ID: " + technicianId);
        }
        return timeLogRepository.findByTechnicianId(technicianId);
    }
}
