package com.meridian.capstone.service;

import com.meridian.capstone.domain.Customer;
import com.meridian.capstone.domain.Site;
import com.meridian.capstone.dto.SiteCreateRequest;
import com.meridian.capstone.dto.SiteDTO;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.CustomerRepository;
import com.meridian.capstone.repository.SiteRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class SiteService {

    @Autowired
    private SiteRepository siteRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public SiteDTO createSite(SiteCreateRequest request) {
        log.info("Creating site: {} for customer: {}", request.getName(), request.getCustomerId());

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));

        Site site = new Site();
        site.setCustomer(customer);
        site.setName(request.getName());
        site.setAddress(request.getAddress());

        Site savedSite = siteRepository.save(site);
        log.info("Site created with ID: {}", savedSite.getId());

        return mapToDTO(savedSite);
    }

    public SiteDTO getSiteById(Long id) {
        log.debug("Fetching site with ID: {}", id);

        Site site = siteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Site not found with ID: " + id));

        return mapToDTO(site);
    }

    public Page<SiteDTO> getAllSites(Pageable pageable) {
        log.debug("Fetching all sites with pagination");

        return siteRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    public Page<SiteDTO> getSitesByCustomer(Long customerId, Pageable pageable) {
        log.debug("Fetching sites for customer: {}", customerId);

        customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        List<Site> sites = siteRepository.findByCustomerId(customerId);
        List<SiteDTO> siteDTOs = sites.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), siteDTOs.size());

        List<SiteDTO> pageContent = siteDTOs.subList(start, end);
        return new PageImpl<>(pageContent, pageable, siteDTOs.size());
    }

    public Page<SiteDTO> searchSites(String searchTerm, Pageable pageable) {
        log.debug("Searching sites with term: {}", searchTerm);

        return siteRepository.searchAllSites(searchTerm, pageable)
                .map(this::mapToDTO);
    }

    public SiteDTO updateSite(Long id, SiteCreateRequest request) {
        log.info("Updating site with ID: {}", id);

        Site site = siteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Site not found with ID: " + id));

        if (!site.getCustomer().getId().equals(request.getCustomerId())) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));
            site.setCustomer(customer);
        }

        site.setName(request.getName());
        site.setAddress(request.getAddress());

        Site updatedSite = siteRepository.save(site);
        log.info("Site updated with ID: {}", id);

        return mapToDTO(updatedSite);
    }

    public void deleteSite(Long id) {
        log.info("Deleting site with ID: {}", id);

        Site site = siteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Site not found with ID: " + id));

        siteRepository.delete(site);
        log.info("Site deleted with ID: {}", id);
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
