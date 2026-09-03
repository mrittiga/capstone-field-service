package com.meridian.capstone.repository;

import com.meridian.capstone.domain.PartsUsed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartsUsedRepository extends JpaRepository<PartsUsed, Long> {

    List<PartsUsed> findByWorkOrderIdOrderByUsedAtDesc(Long workOrderId);

    List<PartsUsed> findByPartIdOrderByUsedAtDesc(Long partId);

    long countByWorkOrderId(Long workOrderId);
}
