package com.meridian.capstone.repository;

import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.domain.WorkOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {

    Page<WorkOrder> findByStatus(WorkOrderStatus status, Pageable pageable);

    Page<WorkOrder> findByAssigneeId(Long assigneeId, Pageable pageable);

    Page<WorkOrder> findByCustomerId(Long customerId, Pageable pageable);

    List<WorkOrder> findByStatusIn(List<WorkOrderStatus> statuses);

    @Query("SELECT w FROM WorkOrder w WHERE w.slaDueDate < ?1 AND w.status != 'CLOSED' AND w.status != 'CANCELLED'")
    List<WorkOrder> findOverdueWorkOrders(LocalDateTime now);

    @Query("SELECT COUNT(w) FROM WorkOrder w WHERE w.status = ?1")
    long countByStatus(WorkOrderStatus status);

    long countByAssigneeId(Long assigneeId);

    boolean existsByWorkOrderCode(String code);
}
