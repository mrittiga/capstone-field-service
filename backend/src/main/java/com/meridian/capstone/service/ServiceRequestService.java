package com.meridian.capstone.service;

import com.meridian.capstone.domain.Customer;
import com.meridian.capstone.domain.ServiceRequest;
import com.meridian.capstone.domain.Site;
import com.meridian.capstone.dto.ServiceRequestCreateRequest;
import com.meridian.capstone.dto.ServiceRequestDTO;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.CustomerRepository;
import com.meridian.capstone.repository.ServiceRequestRepository;
import com.meridian.capstone.repository.SiteRepository;
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
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SiteRepository siteRepository;

    @Autowired
    private NotificationService notificationService;

    public ServiceRequestDTO createServiceRequest(ServiceRequestCreateRequest request, Long customerId) {
        log.info("Creating service request for customer: {}", customerId);

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerId));

        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setCustomer(customer);
        serviceRequest.setTitle(request.getTitle());
        serviceRequest.setDescription(request.getDescription());
        serviceRequest.setPriority(request.getPriority());
        serviceRequest.setStatus("OPEN");
        serviceRequest.setRequestedDate(request.getRequestedDate());
        serviceRequest.setPreferredTimeWindow(request.getPreferredTimeWindow());
        serviceRequest.setCreatedAt(LocalDateTime.now());
        serviceRequest.setUpdatedAt(LocalDateTime.now());

        if (request.getSiteId() != null) {
            Site site = siteRepository.findById(request.getSiteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Site not found: " + request.getSiteId()));
            serviceRequest.setSite(site);
        }

        ServiceRequest saved = serviceRequestRepository.save(serviceRequest);
        log.info("Service request created successfully: {}", saved.getId());

        return mapToDTO(saved);
    }

    public Page<ServiceRequestDTO> getCustomerRequests(Long customerId, Pageable pageable) {
        log.debug("Fetching service requests for customer: {}", customerId);

        Page<ServiceRequest> requests = serviceRequestRepository.findByCustomerId(customerId, pageable);
        return requests.map(this::mapToDTO);
    }

    public Page<ServiceRequestDTO> getRequestsByStatus(String status, Pageable pageable) {
        log.debug("Fetching service requests with status: {}", status);

        Page<ServiceRequest> requests = serviceRequestRepository.findByStatus(status, pageable);
        return requests.map(this::mapToDTO);
    }

    public ServiceRequestDTO getServiceRequest(Long requestId) {
        log.debug("Fetching service request: {}", requestId);

        ServiceRequest serviceRequest = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found: " + requestId));

        return mapToDTO(serviceRequest);
    }

    public ServiceRequestDTO updateStatus(Long requestId, String newStatus) {
        log.info("Updating service request {} status to: {}", requestId, newStatus);

        ServiceRequest serviceRequest = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found: " + requestId));

        serviceRequest.setStatus(newStatus);
        serviceRequest.setUpdatedAt(LocalDateTime.now());

        ServiceRequest updated = serviceRequestRepository.save(serviceRequest);
        log.info("Service request status updated: {}", requestId);

        return mapToDTO(updated);
    }

    public long getPendingRequestCount() {
        return serviceRequestRepository.countByStatus("OPEN");
    }

    private ServiceRequestDTO mapToDTO(ServiceRequest request) {
        return new ServiceRequestDTO(
                request.getId(),
                request.getCustomer().getId(),
                request.getCustomer().getName(),
                request.getTitle(),
                request.getDescription(),
                request.getPriority(),
                request.getStatus(),
                request.getSite() != null ? request.getSite().getId() : null,
                request.getSite() != null ? request.getSite().getName() : null,
                request.getAssignedWorkOrder() != null ? request.getAssignedWorkOrder().getId() : null,
                request.getRequestedDate(),
                request.getPreferredTimeWindow(),
                request.getCreatedAt(),
                request.getUpdatedAt()
        );
    }
}
