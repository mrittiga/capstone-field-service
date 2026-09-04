package com.meridian.capstone.repository;

import com.meridian.capstone.domain.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByContactEmail(String contactEmail);

    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
           "LOWER(c.contactEmail) LIKE LOWER(CONCAT('%', ?1, '%'))")
    Page<Customer> searchByNameOrEmail(String query, Pageable pageable);
}
