package com.meridian.capstone.repository;

import com.meridian.capstone.domain.Site;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteRepository extends JpaRepository<Site, Long> {

    List<Site> findByCustomerId(Long customerId);

    @Query("SELECT s FROM Site s WHERE " +
           "s.customerId = ?1 AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', ?2, '%')) OR " +
           "LOWER(s.address) LIKE LOWER(CONCAT('%', ?2, '%')))")
    Page<Site> searchByCustomerAndQuery(Long customerId, String query, Pageable pageable);

    @Query("SELECT s FROM Site s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
           "LOWER(s.address) LIKE LOWER(CONCAT('%', ?1, '%'))")
    Page<Site> search(String query, Pageable pageable);
}
