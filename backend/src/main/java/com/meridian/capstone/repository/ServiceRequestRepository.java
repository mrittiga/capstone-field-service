package com.meridian.capstone.repository;

import com.meridian.capstone.domain.ServiceRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    Page<ServiceRequest> findByCustomerId(Long customerId, Pageable pageable);

    Page<ServiceRequest> findByStatus(String status, Pageable pageable);

    Page<ServiceRequest> findByCustomerIdAndStatus(Long customerId, String status, Pageable pageable);

    List<ServiceRequest> findBySiteIdOrderByCreatedAtDesc(Long siteId);

    long countByStatus(String status);

    long countByCustomerIdAndStatus(Long customerId, String status);
}
