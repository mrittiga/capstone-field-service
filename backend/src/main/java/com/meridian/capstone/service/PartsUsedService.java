package com.meridian.capstone.service;

import com.meridian.capstone.domain.Part;
import com.meridian.capstone.domain.PartsUsed;
import com.meridian.capstone.domain.User;
import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.dto.PartsUsedCreateRequest;
import com.meridian.capstone.dto.PartsUsedDTO;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.PartsUsedRepository;
import com.meridian.capstone.repository.PartRepository;
import com.meridian.capstone.repository.UserRepository;
import com.meridian.capstone.repository.WorkOrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@Transactional
public class PartsUsedService {

    @Autowired
    private PartsUsedRepository partsUsedRepository;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private PartRepository partRepository;

    @Autowired
    private UserRepository userRepository;

    public PartsUsedDTO addPartToWorkOrder(Long workOrderId, PartsUsedCreateRequest request, String userEmail) {
        log.info("Adding part {} to work order: {}", request.getPartId(), workOrderId);

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found: " + workOrderId));

        Part part = partRepository.findById(request.getPartId())
                .orElseThrow(() -> new ResourceNotFoundException("Part not found: " + request.getPartId()));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        PartsUsed partsUsed = new PartsUsed();
        partsUsed.setWorkOrder(workOrder);
        partsUsed.setPart(part);
        partsUsed.setQuantity(request.getQuantity());
        partsUsed.setUsedAt(LocalDateTime.now());
        partsUsed.setAddedBy(user);

        PartsUsed saved = partsUsedRepository.save(partsUsed);
        log.info("Part added to work order successfully: {}", workOrderId);

        return mapToDTO(saved);
    }

    public List<PartsUsedDTO> getWorkOrderParts(Long workOrderId) {
        log.debug("Fetching parts used for work order: {}", workOrderId);

        List<PartsUsed> parts = partsUsedRepository.findByWorkOrderIdOrderByUsedAtDesc(workOrderId);
        return parts.stream().map(this::mapToDTO).toList();
    }

    public void removePartFromWorkOrder(Long partsUsedId) {
        log.info("Removing part usage record: {}", partsUsedId);

        PartsUsed partsUsed = partsUsedRepository.findById(partsUsedId)
                .orElseThrow(() -> new ResourceNotFoundException("Parts usage record not found: " + partsUsedId));

        partsUsedRepository.deleteById(partsUsedId);
        log.info("Part removed from work order: {}", partsUsedId);
    }

    public long getPartUsageCount(Long partId) {
        log.debug("Getting usage count for part: {}", partId);
        return partsUsedRepository.countByWorkOrderId(partId);
    }

    private PartsUsedDTO mapToDTO(PartsUsed partsUsed) {
        return new PartsUsedDTO(
                partsUsed.getId(),
                partsUsed.getWorkOrder().getId(),
                partsUsed.getPart().getId(),
                partsUsed.getPart().getName(),
                partsUsed.getQuantity(),
                partsUsed.getUsedAt(),
                partsUsed.getAddedBy() != null ? partsUsed.getAddedBy().getId() : null,
                partsUsed.getAddedBy() != null ? partsUsed.getAddedBy().getName() : null
        );
    }
}
