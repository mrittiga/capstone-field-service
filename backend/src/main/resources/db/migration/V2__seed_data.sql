-- Insert test users with BCrypt hashed passwords
-- Password: password123

INSERT INTO app_user (email, name, password_hash, role, created_at, updated_at) VALUES
('dispatcher@test.com', 'John Dispatcher', '$2a$10$7VhNFPgKDJOyT5lQ5rT6tOQ6Q8vU8e5Z3J5Y7R6N5K4M3L2J1H0', 'DISPATCHER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('technician@test.com', 'Mike Technician', '$2a$10$7VhNFPgKDJOyT5lQ5rT6tOQ6Q8vU8e5Z3J5Y7R6N5K4M3L2J1H0', 'TECHNICIAN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('manager@test.com', 'Sarah Manager', '$2a$10$7VhNFPgKDJOyT5lQ5rT6tOQ6Q8vU8e5Z3J5Y7R6N5K4M3L2J1H0', 'MANAGER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('customer@test.com', 'Alice Customer', '$2a$10$7VhNFPgKDJOyT5lQ5rT6tOQ6Q8vU8e5Z3J5Y7R6N5K4M3L2J1H0', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test customers
INSERT INTO customer (name, contact_email, created_at, updated_at) VALUES
('Acme Corporation', 'contact@acme.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('TechStart Inc', 'hello@techstart.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Global Services Ltd', 'support@globalservices.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test sites
INSERT INTO site (customer_id, name, address, created_at, updated_at) VALUES
(1, 'Acme Headquarters', '123 Main St, New York, NY 10001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Acme Branch Office', '456 Oak Ave, Boston, MA 02101', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'TechStart Office', '789 Tech Blvd, San Francisco, CA 94102', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Global Services Hub', '321 Business Park, Chicago, IL 60601', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test parts
INSERT INTO part (name, sku, unit_cost, current_stock, created_at, updated_at) VALUES
('Air Filter', 'AF-001', 25.00, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Oil Filter', 'OF-002', 15.00, 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Spark Plug Set', 'SP-003', 45.00, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brake Pad Set', 'BP-004', 85.00, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Battery', 'BAT-005', 120.00, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Alternator', 'ALT-006', 250.00, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Starter Motor', 'SM-007', 180.00, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Radiator', 'RAD-008', 220.00, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
