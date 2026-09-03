package com.meridian.capstone.service;

import com.meridian.capstone.domain.User;
import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.domain.WorkOrderPhoto;
import com.meridian.capstone.dto.WorkOrderPhotoCreateRequest;
import com.meridian.capstone.dto.WorkOrderPhotoDTO;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.UserRepository;
import com.meridian.capstone.repository.WorkOrderPhotoRepository;
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
public class WorkOrderPhotoService {

    @Autowired
    private WorkOrderPhotoRepository photoRepository;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private UserRepository userRepository;

    public WorkOrderPhotoDTO uploadPhoto(Long workOrderId, WorkOrderPhotoCreateRequest request, String userEmail) {
        log.info("Uploading photo for work order: {} by user: {}", workOrderId, userEmail);

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found: " + workOrderId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        WorkOrderPhoto photo = new WorkOrderPhoto();
        photo.setWorkOrder(workOrder);
        photo.setPhotoUrl(request.getPhotoUrl());
        photo.setPhotoType(request.getPhotoType());
        photo.setUploadedBy(user);
        photo.setCreatedAt(LocalDateTime.now());

        WorkOrderPhoto saved = photoRepository.save(photo);
        log.info("Photo uploaded successfully for work order: {}", workOrderId);

        return mapToDTO(saved);
    }

    public List<WorkOrderPhotoDTO> getWorkOrderPhotos(Long workOrderId) {
        log.debug("Fetching photos for work order: {}", workOrderId);

        List<WorkOrderPhoto> photos = photoRepository.findByWorkOrderIdOrderByCreatedAtDesc(workOrderId);
        return photos.stream().map(this::mapToDTO).toList();
    }

    public List<WorkOrderPhotoDTO> getPhotosByType(Long workOrderId, String photoType) {
        log.debug("Fetching {} photos for work order: {}", photoType, workOrderId);

        List<WorkOrderPhoto> photos = photoRepository.findByWorkOrderIdAndPhotoType(workOrderId, photoType);
        return photos.stream().map(this::mapToDTO).toList();
    }

    public void deletePhoto(Long photoId) {
        log.info("Deleting photo: {}", photoId);

        WorkOrderPhoto photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found: " + photoId));

        photoRepository.deleteById(photoId);
        log.info("Photo deleted: {}", photoId);
    }

    public long getPhotoCount(Long workOrderId) {
        return photoRepository.countByWorkOrderId(workOrderId);
    }

    private WorkOrderPhotoDTO mapToDTO(WorkOrderPhoto photo) {
        return new WorkOrderPhotoDTO(
                photo.getId(),
                photo.getWorkOrder().getId(),
                photo.getPhotoUrl(),
                photo.getPhotoType(),
                photo.getUploadedBy() != null ? photo.getUploadedBy().getId() : null,
                photo.getUploadedBy() != null ? photo.getUploadedBy().getName() : null,
                photo.getCreatedAt()
        );
    }
}
