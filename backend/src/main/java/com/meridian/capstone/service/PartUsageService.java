package com.meridian.capstone.service;

import com.meridian.capstone.domain.Part;
import com.meridian.capstone.domain.PartUsage;
import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.dto.PartUsageRequest;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.PartRepository;
import com.meridian.capstone.repository.PartUsageRepository;
import com.meridian.capstone.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PartUsageService {

    private final PartUsageRepository partUsageRepository;
    private final PartRepository partRepository;
    private final WorkOrderRepository workOrderRepository;

    @Transactional
    public void logPartUsage(Long workOrderId, PartUsageRequest request) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
            .orElseThrow(() -> new ResourceNotFoundException("Work order not found with ID: " + workOrderId));

        Part part = partRepository.findById(request.getPartId())
            .orElseThrow(() -> new ResourceNotFoundException("Part not found with ID: " + request.getPartId()));

        if (part.getCurrentStock() < request.getQuantity()) {
            throw new IllegalArgumentException("Insufficient stock for part: " + part.getName());
        }

        PartUsage partUsage = new PartUsage();
        partUsage.setWorkOrder(workOrder);
        partUsage.setPart(part);
        partUsage.setQuantityUsed(request.getQuantity());
        partUsageRepository.save(partUsage);

        // Decrement stock
        part.setCurrentStock(part.getCurrentStock() - request.getQuantity());
        partRepository.save(part);

        // Update work order total parts cost
        BigDecimal partCost = part.getUnitCost().multiply(BigDecimal.valueOf(request.getQuantity()));
        workOrder.setTotalPartsCost(workOrder.getTotalPartsCost().add(partCost));
        workOrderRepository.save(workOrder);
    }

    @Transactional(readOnly = true)
    public List<PartUsage> getPartUsageByWorkOrder(Long workOrderId) {
        if (!workOrderRepository.existsById(workOrderId)) {
            throw new ResourceNotFoundException("Work order not found with ID: " + workOrderId);
        }
        return partUsageRepository.findByWorkOrderId(workOrderId);
    }
}
