-- Insert test users
INSERT INTO app_user (email, name, password_hash, role, created_at, updated_at) VALUES
('dispatcher@test.com', 'John Dispatcher', '$2a$10$Z6.e.hB9tT8VjKTX.TnWzOp3YvPL9r7WS4VPhjJXvNM6GNqZe8IBm', 'DISPATCHER', NOW(), NOW()),
('technician1@test.com', 'Mike Technician', '$2a$10$Z6.e.hB9tT8VjKTX.TnWzOp3YvPL9r7WS4VPhjJXvNM6GNqZe8IBm', 'TECHNICIAN', NOW(), NOW()),
('technician2@test.com', 'Sarah Technician', '$2a$10$Z6.e.hB9tT8VjKTX.TnWzOp3YvPL9r7WS4VPhjJXvNM6GNqZe8IBm', 'TECHNICIAN', NOW(), NOW()),
('manager@test.com', 'Admin Manager', '$2a$10$Z6.e.hB9tT8VjKTX.TnWzOp3YvPL9r7WS4VPhjJXvNM6GNqZe8IBm', 'MANAGER', NOW(), NOW()),
('customer1@test.com', 'ABC Corp', '$2a$10$Z6.e.hB9tT8VjKTX.TnWzOp3YvPL9r7WS4VPhjJXvNM6GNqZe8IBm', 'CUSTOMER', NOW(), NOW()),
('customer2@test.com', 'XYZ Industries', '$2a$10$Z6.e.hB9tT8VjKTX.TnWzOp3YvPL9r7WS4VPhjJXvNM6GNqZe8IBm', 'CUSTOMER', NOW(), NOW());

-- Insert customers
INSERT INTO customer (name, contact_email, phone, created_at, updated_at) VALUES
('ABC Corporation', 'contact@abccorp.com', '555-0001', NOW(), NOW()),
('XYZ Industries', 'contact@xyzind.com', '555-0002', NOW(), NOW()),
('Tech Solutions Inc', 'contact@techsol.com', '555-0003', NOW(), NOW()),
('Manufacturing Co', 'contact@mfgco.com', '555-0004', NOW(), NOW());

-- Insert sites
INSERT INTO site (customer_id, name, address, created_at, updated_at) VALUES
(1, 'ABC Main Office', '123 Business Ave, City, State 12345', NOW(), NOW()),
(1, 'ABC Warehouse', '456 Industrial Blvd, City, State 12345', NOW(), NOW()),
(2, 'XYZ Plant A', '789 Factory Lane, City, State 12345', NOW(), NOW()),
(2, 'XYZ Plant B', '101 Industrial Way, City, State 12345', NOW(), NOW()),
(3, 'Tech Office', '202 Tech Park, City, State 12345', NOW(), NOW()),
(4, 'Manufacturing Facility', '303 Production St, City, State 12345', NOW(), NOW());

-- Insert parts
INSERT INTO part (name, sku, unit_cost, current_stock, created_at, updated_at) VALUES
('Replacement Pump', 'PUMP-001', 150.00, 50, NOW(), NOW()),
('Filter Cartridge', 'FILT-001', 25.00, 200, NOW(), NOW()),
('Valve Assembly', 'VALVE-001', 300.00, 15, NOW(), NOW()),
('Motor Belt', 'BELT-001', 45.00, 75, NOW(), NOW()),
('Gasket Kit', 'GASKET-001', 18.50, 100, NOW(), NOW()),
('Bearing Set', 'BEAR-001', 120.00, 30, NOW(), NOW()),
('Control Board', 'BOARD-001', 450.00, 10, NOW(), NOW()),
('Pressure Gauge', 'GAUGE-001', 85.00, 40, NOW(), NOW());

-- Insert work orders
INSERT INTO work_order (work_order_code, site_id, customer_id, title, description, priority, status, assignee_id, sla_due_date, total_parts_cost, total_time_minutes, created_at, updated_at, completed_at) VALUES
('WO-00000001', 1, 1, 'Pump Replacement', 'Replace main pump with new unit', 'HIGH', 'ASSIGNED', 2, NOW() + INTERVAL '4 hours', 0, 0, NOW(), NOW(), NULL),
('WO-00000002', 1, 1, 'Filter Change', 'Change air filter and inspect system', 'MEDIUM', 'NEW', NULL, NOW() + INTERVAL '24 hours', 0, 0, NOW(), NOW(), NULL),
('WO-00000003', 2, 1, 'Valve Repair', 'Fix leaking discharge valve', 'HIGH', 'IN_PROGRESS', 2, NOW() + INTERVAL '4 hours', 0, 120, NOW(), NOW(), NULL),
('WO-00000004', 3, 2, 'Motor Maintenance', 'Annual motor maintenance and inspection', 'MEDIUM', 'ASSIGNED', 3, NOW() + INTERVAL '24 hours', 0, 0, NOW(), NOW(), NULL),
('WO-00000005', 4, 2, 'Belt Replacement', 'Replace worn motor belt', 'LOW', 'NEW', NULL, NOW() + INTERVAL '72 hours', 0, 0, NOW(), NOW(), NULL),
('WO-00000006', 5, 3, 'System Upgrade', 'Upgrade control system to new version', 'HIGH', 'ASSIGNED', 3, NOW() + INTERVAL '4 hours', 0, 0, NOW(), NOW(), NULL),
('WO-00000007', 6, 4, 'Emergency Repair', 'Production line emergency shutdown', 'HIGH', 'IN_PROGRESS', 2, NOW() + INTERVAL '4 hours', 0, 240, NOW(), NOW(), NULL),
('WO-00000008', 1, 1, 'Routine Inspection', 'Monthly routine inspection', 'LOW', 'COMPLETED', 3, NOW() + INTERVAL '72 hours', 0, 60, NOW(), NOW(), NOW());

-- Insert part usage
INSERT INTO part_usage (work_order_id, part_id, quantity_used, created_at) VALUES
(3, 2, 2, NOW()),
(3, 6, 1, NOW()),
(7, 1, 1, NOW()),
(7, 5, 3, NOW()),
(8, 2, 1, NOW());

-- Insert time logs
INSERT INTO time_log (work_order_id, technician_id, minutes_spent, note, logged_at) VALUES
(3, 2, 120, 'Replaced gaskets and tested valve', NOW()),
(7, 2, 180, 'Diagnosed root cause and started repairs', NOW()),
(7, 2, 60, 'Completed repairs and testing', NOW()),
(8, 3, 60, 'Completed inspection, system operational', NOW());

-- Insert notifications
INSERT INTO notification (user_id, message, type, is_read, created_at) VALUES
(2, 'You have been assigned Work Order WO-00000001', 'ASSIGNMENT', FALSE, NOW()),
(3, 'You have been assigned Work Order WO-00000004', 'ASSIGNMENT', FALSE, NOW()),
(2, 'SLA breach alert: WO-00000007 is breached', 'SLA_BREACH', FALSE, NOW());
