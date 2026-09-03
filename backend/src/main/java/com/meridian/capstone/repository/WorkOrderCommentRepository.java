package com.meridian.capstone.repository;

import com.meridian.capstone.domain.WorkOrderComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkOrderCommentRepository extends JpaRepository<WorkOrderComment, Long> {

    List<WorkOrderComment> findByWorkOrderIdOrderByCreatedAtDesc(Long workOrderId);

    long countByWorkOrderId(Long workOrderId);

    void deleteByWorkOrderId(Long workOrderId);
}
