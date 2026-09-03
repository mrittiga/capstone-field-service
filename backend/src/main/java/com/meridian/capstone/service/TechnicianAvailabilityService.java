package com.meridian.capstone.service;

import com.meridian.capstone.domain.TechnicianAvailability;
import com.meridian.capstone.domain.User;
import com.meridian.capstone.dto.TechnicianAvailabilityCreateRequest;
import com.meridian.capstone.dto.TechnicianAvailabilityDTO;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.TechnicianAvailabilityRepository;
import com.meridian.capstone.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@Transactional
public class TechnicianAvailabilityService {

    @Autowired
    private TechnicianAvailabilityRepository availabilityRepository;

    @Autowired
    private UserRepository userRepository;

    public TechnicianAvailabilityDTO setAvailability(Long technicianId, TechnicianAvailabilityCreateRequest request) {
        log.info("Setting availability for technician: {} on date: {}", technicianId, request.getAvailableDate());

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found: " + technicianId));

        TechnicianAvailability availability = new TechnicianAvailability();
        availability.setTechnician(technician);
        availability.setAvailableDate(request.getAvailableDate());
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());
        availability.setIsAvailable(request.getIsAvailable());
        availability.setNotes(request.getNotes());

        TechnicianAvailability saved = availabilityRepository.save(availability);
        log.info("Availability set for technician: {}", technicianId);

        return mapToDTO(saved);
    }

    public List<TechnicianAvailabilityDTO> getTechnicianAvailability(Long technicianId, LocalDate date) {
        log.debug("Fetching availability for technician: {} on date: {}", technicianId, date);

        List<TechnicianAvailability> availability = availabilityRepository
                .findByTechnicianIdAndAvailableDateOrderByStartTime(technicianId, date);

        return availability.stream().map(this::mapToDTO).toList();
    }

    public List<TechnicianAvailabilityDTO> getAvailableTechnicians(LocalDate date) {
        log.debug("Fetching available technicians for date: {}", date);

        List<TechnicianAvailability> availability = availabilityRepository
                .findByAvailableDateAndIsAvailableTrue(date);

        return availability.stream().map(this::mapToDTO).toList();
    }

    public boolean isTechnicianAvailable(Long technicianId, LocalDate date) {
        return availabilityRepository.existsByTechnicianIdAndAvailableDate(technicianId, date);
    }

    public void deleteAvailability(Long availabilityId) {
        log.info("Deleting availability record: {}", availabilityId);

        TechnicianAvailability availability = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Availability record not found: " + availabilityId));

        availabilityRepository.deleteById(availabilityId);
        log.info("Availability deleted: {}", availabilityId);
    }

    private TechnicianAvailabilityDTO mapToDTO(TechnicianAvailability availability) {
        return new TechnicianAvailabilityDTO(
                availability.getId(),
                availability.getTechnician().getId(),
                availability.getTechnician().getName(),
                availability.getAvailableDate(),
                availability.getStartTime(),
                availability.getEndTime(),
                availability.getIsAvailable(),
                availability.getNotes()
        );
    }
}
