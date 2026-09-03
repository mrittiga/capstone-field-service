package com.meridian.capstone.repository;

import com.meridian.capstone.domain.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Page<Invoice> findByCustomerId(Long customerId, Pageable pageable);

    Page<Invoice> findByStatus(String status, Pageable pageable);

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    List<Invoice> findByWorkOrderId(Long workOrderId);

    Page<Invoice> findByCustomerIdAndStatus(Long customerId, String status, Pageable pageable);

    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.customer.id = :customerId AND i.status = 'PAID'")
    BigDecimal getTotalPaidAmount(Long customerId);

    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.status = 'OVERDUE'")
    long countOverdueInvoices();

    List<Invoice> findByStatusAndIssuedDateBefore(String status, LocalDateTime date);
}
