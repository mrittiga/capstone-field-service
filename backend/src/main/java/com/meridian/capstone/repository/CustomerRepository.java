package com.meridian.capstone.repository;

import com.meridian.capstone.domain.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByName(String name);

    @Query("SELECT c FROM Customer c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(c.contactEmail) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Customer> searchCustomers(@Param("searchTerm") String searchTerm, Pageable pageable);

    boolean existsByName(String name);
}
