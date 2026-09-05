INSERT INTO app_user (email, name, password_hash, role, created_at, updated_at) VALUES
('dispatcher@test.com', 'John Dispatcher', '$2a$10$Z6.e.hB9tT8VjKTX.TnWzOp3YvPL9r7WS4VPhjJXvNM6GNqZe8IBm', 'DISPATCHER', NOW(), NOW()),
('technician1@test.com', 'Mike Technician', '$2a$10$Z6.e.hB9tT8VjKTX.TnWzOp3YvPL9r7WS4VPhjJXvNM6GNqZe8IBm', 'TECHNICIAN', NOW(), NOW()),
('technician2@test.com', 'Sarah Technician', '$2a$10$Z6.e.hB9tT8VjKTX.TnWzOp3YvPL9r7WS4VPhjJXvNM6GNqZe8IBm', 'TECHNICIAN', NOW(), NOW()),
('manager@test.com', 'Sarah Manager', '$2a$10$Z6.e.hB9tT8VjKTX.TnWzOp3YvPL9r7WS4VPhjJXvNM6GNqZe8IBm', 'MANAGER', NOW(), NOW()),
('customer1@test.com', 'Alice Customer', '$2a$10$Z6.e.hB9tT8VjKTX.TnWzOp3YvPL9r7WS4VPhjJXvNM6GNqZe8IBm', 'CUSTOMER', NOW(), NOW()),
('customer2@test.com', 'Bob Customer', '$2a$10$Z6.e.hB9tT8VjKTX.TnWzOp3YvPL9r7WS4VPhjJXvNM6GNqZe8IBm', 'CUSTOMER', NOW(), NOW());

INSERT INTO customer (name, contact_email, phone, created_at, updated_at) VALUES
('ACME Corporation', 'contact@acme.com', '+1-555-0001', NOW(), NOW()),
('Tech Innovations Inc', 'support@techinnovations.com', '+1-555-0002', NOW(), NOW()),
('Global Tech', 'info@globaltech.com', '+1-555-0003', NOW(), NOW()),
('Nexus Ltd', 'support@nexus.com', '+1-555-0188', NOW(), NOW());

INSERT INTO site (customer_id, name, address, created_at, updated_at) VALUES
(1, 'ACME Manhattan Office', '123 Business Ave, Manhattan, NY', NOW(), NOW()),
(1, 'ACME Brooklyn Warehouse', '456 Industrial Blvd, Brooklyn, NY', NOW(), NOW()),
(2, 'Tech SF Campus', '789 Factory Lane, San Francisco, CA', NOW(), NOW()),
(3, 'Global Tech HQ', '101 Industrial Way, Austin, TX', NOW(), NOW()),
(4, 'Nexus Support Center', '202 Tech Park, Seattle, WA', NOW(), NOW());

INSERT INTO part (name, sku, unit_cost, current_stock, description, min_stock_level, created_at, updated_at) VALUES
('HVAC Filter 16×25×1', 'PART_HVAC_001', 150.00, 50, 'Standard air filter', 10, NOW(), NOW()),
('Circuit Breaker 20A', 'PART_ELEC_001', 45.00, 75, '20 Amp circuit breaker', 15, NOW(), NOW()),
('Compressor Unit AC', 'PART_HVAC_002', 450.00, 8, 'AC compressor replacement', 2, NOW(), NOW()),
('PVC Pipe 1 inch', 'PART_PLUMB_001', 25.00, 200, 'PVC piping per meter', 50, NOW(), NOW()),
('Water Valve', 'PART_PLUMB_002', 85.00, 40, 'Main water supply valve', 10, NOW(), NOW());

INSERT INTO work_order (work_order_code, site_id, customer_id, title, description, priority, status, assigned_to_id, sla_due_date, total_parts_cost, total_time_minutes, created_at, updated_at, completed_at) VALUES
('WO-2025-00001', 1, 1, 'HVAC Annual Maintenance', 'Schedule annual HVAC maintenance and inspection', 'MEDIUM', 'NEW', NULL, NOW() + INTERVAL '24 hours', 0, 0, NOW(), NOW(), NULL),
('WO-2025-00002', 2, 1, 'Electrical Panel Repair', 'Fix faulty electrical panel', 'HIGH', 'ASSIGNED', 2, NOW() + INTERVAL '4 hours', 0, 0, NOW(), NOW(), NULL),
('WO-2025-00003', 3, 2, 'Plumbing Inspection', 'Complete plumbing system inspection', 'MEDIUM', 'IN_PROGRESS', 2, NOW() + INTERVAL '24 hours', 0, 120, NOW(), NOW(), NULL),
('WO-2025-00004', 4, 3, 'Emergency AC Unit Failure', 'AC unit emergency repair - high priority', 'URGENT', 'ASSIGNED', 3, NOW() + INTERVAL '2 hours', 0, 0, NOW(), NOW(), NULL);

INSERT INTO notification (user_id, message, type, is_read, created_at) VALUES
(2, 'You have been assigned Work Order WO-2025-00002', 'ASSIGNMENT', FALSE, NOW()),
(3, 'You have been assigned Work Order WO-2025-00004', 'ASSIGNMENT', FALSE, NOW()),
(2, 'SLA breach alert: WO-2025-00003 approaching deadline', 'SLA_BREACH', FALSE, NOW());
