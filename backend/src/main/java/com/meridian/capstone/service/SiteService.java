package com.meridian.capstone.service;

import com.meridian.capstone.domain.Customer;
import com.meridian.capstone.domain.Site;
import com.meridian.capstone.dto.SiteCreateRequest;
import com.meridian.capstone.dto.SiteDTO;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.CustomerRepository;
import com.meridian.capstone.repository.SiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SiteService {

    private final SiteRepository siteRepository;
    private final CustomerRepository customerRepository;

    @Transactional
    public SiteDTO createSite(SiteCreateRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));

        Site site = new Site();
        site.setCustomer(customer);
        site.setName(request.getName());
        site.setAddress(request.getAddress());

        Site savedSite = siteRepository.save(site);
        return mapToDTO(savedSite);
    }

    @Transactional(readOnly = true)
    public SiteDTO getSite(Long id) {
        Site site = siteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Site not found with ID: " + id));
        return mapToDTO(site);
    }

    @Transactional(readOnly = true)
    public Page<SiteDTO> getAllSites(Pageable pageable) {
        return siteRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public List<SiteDTO> getSitesByCustomer(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer not found with ID: " + customerId);
        }
        return siteRepository.findByCustomerId(customerId)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<SiteDTO> searchSites(String query, Pageable pageable) {
        return siteRepository.search(query, pageable).map(this::mapToDTO);
    }

    @Transactional
    public SiteDTO updateSite(Long id, SiteCreateRequest request) {
        Site site = siteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Site not found with ID: " + id));

        Customer customer = customerRepository.findById(request.getCustomerId())
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));

        site.setCustomer(customer);
        site.setName(request.getName());
        site.setAddress(request.getAddress());

        Site updatedSite = siteRepository.save(site);
        return mapToDTO(updatedSite);
    }

    @Transactional
    public void deleteSite(Long id) {
        if (!siteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Site not found with ID: " + id);
        }
        siteRepository.deleteById(id);
    }

    private SiteDTO mapToDTO(Site site) {
        return new SiteDTO(
            site.getId(),
            site.getCustomer().getId(),
            site.getCustomer().getName(),
            site.getName(),
            site.getAddress(),
            site.getCreatedAt(),
            site.getUpdatedAt()
        );
    }
}
