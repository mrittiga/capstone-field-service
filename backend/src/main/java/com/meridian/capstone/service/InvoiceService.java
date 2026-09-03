package com.meridian.capstone.service;

import com.meridian.capstone.domain.Invoice;
import com.meridian.capstone.domain.User;
import com.meridian.capstone.domain.WorkOrder;
import com.meridian.capstone.dto.InvoiceCreateRequest;
import com.meridian.capstone.dto.InvoiceDTO;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.InvoiceRepository;
import com.meridian.capstone.repository.UserRepository;
import com.meridian.capstone.repository.WorkOrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@Transactional
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private UserRepository userRepository;

    public InvoiceDTO createInvoice(InvoiceCreateRequest request) {
        log.info("Creating invoice for work order: {}", request.getWorkOrderId());

        WorkOrder workOrder = workOrderRepository.findById(request.getWorkOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found: " + request.getWorkOrderId()));

        Invoice invoice = new Invoice();
        invoice.setWorkOrder(workOrder);
        invoice.setCustomer(workOrder.getCustomer());
        invoice.setInvoiceNumber(generateInvoiceNumber());
        invoice.setTotalAmount(request.getTotalAmount());
        invoice.setTaxAmount(request.getTaxAmount() != null ? request.getTaxAmount() : BigDecimal.ZERO);
        invoice.setStatus("PENDING");
        invoice.setIssuedDate(LocalDateTime.now());
        invoice.setDueDate(request.getDueDate());
        invoice.setCreatedAt(LocalDateTime.now());

        Invoice saved = invoiceRepository.save(invoice);
        log.info("Invoice created successfully: {}", saved.getInvoiceNumber());

        return mapToDTO(saved);
    }

    public Page<InvoiceDTO> getCustomerInvoices(Long customerId, Pageable pageable) {
        log.debug("Fetching invoices for customer: {}", customerId);

        Page<Invoice> invoices = invoiceRepository.findByCustomerId(customerId, pageable);
        return invoices.map(this::mapToDTO);
    }

    public Page<InvoiceDTO> getInvoicesByStatus(String status, Pageable pageable) {
        log.debug("Fetching invoices with status: {}", status);

        Page<Invoice> invoices = invoiceRepository.findByStatus(status, pageable);
        return invoices.map(this::mapToDTO);
    }

    public InvoiceDTO getInvoice(Long invoiceId) {
        log.debug("Fetching invoice: {}", invoiceId);

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceId));

        return mapToDTO(invoice);
    }

    public InvoiceDTO markAsPaid(Long invoiceId) {
        log.info("Marking invoice {} as paid", invoiceId);

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceId));

        invoice.setStatus("PAID");
        invoice.setPaidDate(LocalDateTime.now());

        Invoice updated = invoiceRepository.save(invoice);
        log.info("Invoice marked as paid: {}", invoiceId);

        return mapToDTO(updated);
    }

    public InvoiceDTO markAsSent(Long invoiceId) {
        log.info("Marking invoice {} as sent", invoiceId);

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + invoiceId));

        invoice.setStatus("SENT");

        Invoice updated = invoiceRepository.save(invoice);
        log.info("Invoice marked as sent: {}", invoiceId);

        return mapToDTO(updated);
    }

    public BigDecimal getCustomerTotalPaid(Long customerId) {
        log.debug("Calculating total paid amount for customer: {}", customerId);

        BigDecimal total = invoiceRepository.getTotalPaidAmount(customerId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public long getOverdueInvoiceCount() {
        return invoiceRepository.countOverdueInvoices();
    }

    private String generateInvoiceNumber() {
        return "INV-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private InvoiceDTO mapToDTO(Invoice invoice) {
        return new InvoiceDTO(
                invoice.getId(),
                invoice.getWorkOrder().getId(),
                invoice.getWorkOrder().getTitle(),
                invoice.getCustomer().getId(),
                invoice.getCustomer().getName(),
                invoice.getInvoiceNumber(),
                invoice.getTotalAmount(),
                invoice.getTaxAmount(),
                invoice.getStatus(),
                invoice.getIssuedDate(),
                invoice.getDueDate(),
                invoice.getPaidDate(),
                invoice.getCreatedAt()
        );
    }
}
