package com.meridian.capstone.service;

import com.meridian.capstone.domain.User;
import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.domain.WorkOrderRating;
import com.meridian.capstone.dto.WorkOrderRatingCreateRequest;
import com.meridian.capstone.dto.WorkOrderRatingDTO;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.UserRepository;
import com.meridian.capstone.repository.WorkOrderRatingRepository;
import com.meridian.capstone.repository.WorkOrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@Transactional
public class WorkOrderRatingService {

    @Autowired
    private WorkOrderRatingRepository ratingRepository;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private UserRepository userRepository;

    public WorkOrderRatingDTO rateWorkOrder(Long workOrderId, WorkOrderRatingCreateRequest request, String customerEmail) {
        log.info("Rating work order: {} by customer: {}", workOrderId, customerEmail);

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found: " + workOrderId));

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerEmail));

        // Check if already rated
        if (ratingRepository.findByWorkOrderId(workOrderId).isPresent()) {
            throw new IllegalArgumentException("This work order has already been rated");
        }

        WorkOrderRating rating = new WorkOrderRating();
        rating.setWorkOrder(workOrder);
        rating.setCustomer(customer);
        rating.setRating(request.getRating());
        rating.setReviewText(request.getReviewText());
        rating.setCreatedAt(LocalDateTime.now());

        WorkOrderRating saved = ratingRepository.save(rating);
        log.info("Work order rated successfully: {}", workOrderId);

        return mapToDTO(saved);
    }

    public WorkOrderRatingDTO getWorkOrderRating(Long workOrderId) {
        log.debug("Fetching rating for work order: {}", workOrderId);

        WorkOrderRating rating = ratingRepository.findByWorkOrderId(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found for work order: " + workOrderId));

        return mapToDTO(rating);
    }

    public Page<WorkOrderRatingDTO> getCustomerRatings(Long customerId, Pageable pageable) {
        log.debug("Fetching ratings for customer: {}", customerId);

        Page<WorkOrderRating> ratings = ratingRepository.findByCustomerId(customerId, pageable);
        return ratings.map(this::mapToDTO);
    }

    public Double getAverageRatingForCustomer(Long customerId) {
        log.debug("Getting average rating for customer: {}", customerId);

        Double average = ratingRepository.getAverageRatingForCustomer(customerId);
        return average != null ? average : 0.0;
    }

    public Double getOverallAverageRating() {
        log.debug("Getting overall average rating");

        Double average = ratingRepository.getOverallAverageRating();
        return average != null ? average : 0.0;
    }

    private WorkOrderRatingDTO mapToDTO(WorkOrderRating rating) {
        return new WorkOrderRatingDTO(
                rating.getId(),
                rating.getWorkOrder().getId(),
                rating.getWorkOrder().getTitle(),
                rating.getCustomer().getId(),
                rating.getCustomer().getName(),
                rating.getRating(),
                rating.getReviewText(),
                rating.getCreatedAt()
        );
    }
}
