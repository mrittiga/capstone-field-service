package com.meridian.capstone.service;

import com.meridian.capstone.domain.Customer;
import com.meridian.capstone.dto.CustomerCreateRequest;
import com.meridian.capstone.dto.CustomerDTO;
import com.meridian.capstone.exception.ResourceNotFoundException;
import com.meridian.capstone.repository.CustomerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public CustomerDTO createCustomer(CustomerCreateRequest request) {
        log.info("Creating customer: {}", request.getName());

        if (customerRepository.existsByName(request.getName())) {
            throw new RuntimeException("Customer with name '" + request.getName() + "' already exists");
        }

        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setContactEmail(request.getContactEmail());

        Customer savedCustomer = customerRepository.save(customer);
        log.info("Customer created with ID: {}", savedCustomer.getId());

        return mapToDTO(savedCustomer);
    }

    public CustomerDTO getCustomerById(Long id) {
        log.debug("Fetching customer with ID: {}", id);

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        return mapToDTO(customer);
    }

    public Page<CustomerDTO> getAllCustomers(Pageable pageable) {
        log.debug("Fetching all customers with pagination");

        return customerRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    public Page<CustomerDTO> searchCustomers(String searchTerm, Pageable pageable) {
        log.debug("Searching customers with term: {}", searchTerm);

        return customerRepository.searchCustomers(searchTerm, pageable)
                .map(this::mapToDTO);
    }

    public CustomerDTO updateCustomer(Long id, CustomerCreateRequest request) {
        log.info("Updating customer with ID: {}", id);

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        customer.setName(request.getName());
        customer.setContactEmail(request.getContactEmail());

        Customer updatedCustomer = customerRepository.save(customer);
        log.info("Customer updated with ID: {}", id);

        return mapToDTO(updatedCustomer);
    }

    public void deleteCustomer(Long id) {
        log.info("Deleting customer with ID: {}", id);

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        customerRepository.delete(customer);
        log.info("Customer deleted with ID: {}", id);
    }

    private CustomerDTO mapToDTO(Customer customer) {
        return new CustomerDTO(
                customer.getId(),
                customer.getName(),
                customer.getContactEmail(),
                customer.getCreatedAt(),
                customer.getUpdatedAt()
        );
    }
}
