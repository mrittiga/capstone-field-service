package com.meridian.capstone.repository;

import com.meridian.capstone.domain.WorkOrderRating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkOrderRatingRepository extends JpaRepository<WorkOrderRating, Long> {

    Optional<WorkOrderRating> findByWorkOrderId(Long workOrderId);

    Page<WorkOrderRating> findByCustomerId(Long customerId, Pageable pageable);

    List<WorkOrderRating> findByWorkOrderIdOrderByCreatedAtDesc(Long workOrderId);

    @Query("SELECT AVG(r.rating) FROM WorkOrderRating r WHERE r.workOrder.site.customer.id = :customerId")
    Double getAverageRatingForCustomer(Long customerId);

    @Query("SELECT AVG(r.rating) FROM WorkOrderRating r")
    Double getOverallAverageRating();

    long countByRating(Integer rating);
}
