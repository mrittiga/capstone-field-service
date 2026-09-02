package com.meridian.capstone.repository;

import com.meridian.capstone.domain.Site;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteRepository extends JpaRepository<Site, Long> {

    List<Site> findByCustomerId(Long customerId);

    @Query("SELECT s FROM Site s WHERE s.customer.id = :customerId AND (LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(s.address) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Site> searchSitesByCustomer(@Param("customerId") Long customerId, @Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT s FROM Site s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(s.address) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Site> searchAllSites(@Param("searchTerm") String searchTerm, Pageable pageable);
}
