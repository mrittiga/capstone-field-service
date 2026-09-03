package com.meridian.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDTO {

    private Long id;
    private Long workOrderId;
    private String workOrderTitle;
    private Long customerId;
    private String customerName;
    private String invoiceNumber;
    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private String status; // PENDING, SENT, PAID, OVERDUE, CANCELLED
    private LocalDateTime issuedDate;
    private LocalDate dueDate;
    private LocalDateTime paidDate;
    private LocalDateTime createdAt;
}
