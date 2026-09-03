package com.meridian.capstone.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "invoice")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(unique = true)
    private String invoiceNumber;

    private BigDecimal totalAmount;

    private BigDecimal taxAmount;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, SENT, PAID, OVERDUE, CANCELLED

    private LocalDateTime issuedDate;

    private LocalDate dueDate;

    private LocalDateTime paidDate;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
