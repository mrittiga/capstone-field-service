package com.meridian.capstone.repository;

import com.meridian.capstone.domain.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartRepository extends JpaRepository<Part, Long> {

    List<Part> findByNameContainingIgnoreCase(String name);

    List<Part> findBySku(String sku);

    long countByQuantityLessThan(Integer quantity);
}
