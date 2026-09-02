package com.meridian.capstone.repository;

import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.domain.WorkOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {

    List<WorkOrder> findByStatus(WorkOrderStatus status);

    List<WorkOrder> findByAssigneeId(Long assigneeId);

    Page<WorkOrder> findByCustomerId(Long customerId, Pageable pageable);

    Page<WorkOrder> findBySiteId(Long siteId, Pageable pageable);

    @Query("SELECT w FROM WorkOrder w WHERE w.status = :status")
    Page<WorkOrder> findByStatusPaginated(@Param("status") WorkOrderStatus status, Pageable pageable);

    @Query("SELECT w FROM WorkOrder w WHERE LOWER(w.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(w.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<WorkOrder> searchWorkOrders(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT w FROM WorkOrder w WHERE w.assignee.id = :technicianId AND w.status IN (com.meridian.capstone.domain.WorkOrderStatus.ASSIGNED, com.meridian.capstone.domain.WorkOrderStatus.IN_PROGRESS, com.meridian.capstone.domain.WorkOrderStatus.ON_HOLD)")
    List<WorkOrder> findAssignedJobsForTechnician(@Param("technicianId") Long technicianId);
}
