package com.meridian.capstone.service;

import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.domain.WorkOrderComment;
import com.meridian.capstone.domain.User;
import com.meridian.capstone.dto.WorkOrderCommentCreateRequest;
import com.meridian.capstone.dto.WorkOrderCommentDTO;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.WorkOrderCommentRepository;
import com.meridian.capstone.repository.WorkOrderRepository;
import com.meridian.capstone.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@Transactional
public class WorkOrderCommentService {

    @Autowired
    private WorkOrderCommentRepository commentRepository;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private UserRepository userRepository;

    public WorkOrderCommentDTO addComment(Long workOrderId, WorkOrderCommentCreateRequest request, String userEmail) {
        log.info("Adding comment to work order: {} by user: {}", workOrderId, userEmail);

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found: " + workOrderId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        WorkOrderComment comment = new WorkOrderComment();
        comment.setWorkOrder(workOrder);
        comment.setUser(user);
        comment.setMessage(request.getMessage());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());

        WorkOrderComment savedComment = commentRepository.save(comment);
        log.info("Comment added successfully to work order: {}", workOrderId);

        return mapToDTO(savedComment);
    }

    public List<WorkOrderCommentDTO> getWorkOrderComments(Long workOrderId) {
        log.debug("Fetching comments for work order: {}", workOrderId);

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found: " + workOrderId));

        List<WorkOrderComment> comments = commentRepository.findByWorkOrderIdOrderByCreatedAtDesc(workOrderId);
        return comments.stream().map(this::mapToDTO).toList();
    }

    public void deleteComment(Long commentId, String userEmail) {
        log.info("Deleting comment: {} by user: {}", commentId, userEmail);

        WorkOrderComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + commentId));

        if (!comment.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("You can only delete your own comments");
        }

        commentRepository.deleteById(commentId);
        log.info("Comment deleted successfully: {}", commentId);
    }

    private WorkOrderCommentDTO mapToDTO(WorkOrderComment comment) {
        return new WorkOrderCommentDTO(
                comment.getId(),
                comment.getWorkOrder().getId(),
                comment.getUser().getId(),
                comment.getUser().getName(),
                comment.getMessage(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}
