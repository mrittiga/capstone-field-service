package com.meridian.capstone.repository;

import com.meridian.capstone.domain.TechnicianAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TechnicianAvailabilityRepository extends JpaRepository<TechnicianAvailability, Long> {

    List<TechnicianAvailability> findByTechnicianIdAndAvailableDateOrderByStartTime(Long technicianId, LocalDate date);

    List<TechnicianAvailability> findByTechnicianIdAndIsAvailableTrue(Long technicianId);

    List<TechnicianAvailability> findByAvailableDateAndIsAvailableTrue(LocalDate date);

    boolean existsByTechnicianIdAndAvailableDate(Long technicianId, LocalDate date);
}
