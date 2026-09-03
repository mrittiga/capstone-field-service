package com.meridian.capstone.repository;

import com.meridian.capstone.domain.WorkOrderPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkOrderPhotoRepository extends JpaRepository<WorkOrderPhoto, Long> {

    List<WorkOrderPhoto> findByWorkOrderIdOrderByCreatedAtDesc(Long workOrderId);

    List<WorkOrderPhoto> findByWorkOrderIdAndPhotoType(Long workOrderId, String photoType);

    long countByWorkOrderId(Long workOrderId);
}
