-- INSERT SEED DATA (WITHOUT explicit IDs - let H2 auto-generate)
INSERT INTO customer (name, contact_email, created_at, updated_at) VALUES
('Acme Corporation', 'contact@acme.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO customer (name, contact_email, created_at, updated_at) VALUES
('TechStart Inc', 'hello@techstart.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO customer (name, contact_email, created_at, updated_at) VALUES
('Global Services Ltd', 'support@globalservices.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO site (customer_id, name, address, created_at, updated_at) VALUES
(1, 'Acme Headquarters', '123 Main St, New York, NY 10001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO site (customer_id, name, address, created_at, updated_at) VALUES
(1, 'Acme Branch Office', '456 Oak Ave, Boston, MA 02101', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO site (customer_id, name, address, created_at, updated_at) VALUES
(2, 'TechStart Office', '789 Tech Blvd, San Francisco, CA 94102', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO site (customer_id, name, address, created_at, updated_at) VALUES
(3, 'Global Services Hub', '321 Business Park, Chicago, IL 60601', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO work_order (site_id, customer_id, title, description, priority, status, created_at, updated_at) VALUES
(1, 1, 'HVAC Maintenance', 'Quarterly HVAC system inspection', 'MEDIUM', 'NEW', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO work_order (site_id, customer_id, title, description, priority, status, created_at, updated_at) VALUES
(1, 1, 'Electrical Repair', 'Fix faulty circuit breaker', 'HIGH', 'NEW', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO work_order (site_id, customer_id, title, description, priority, status, created_at, updated_at) VALUES
(2, 1, 'Plumbing Issue', 'Repair leaking pipes', 'MEDIUM', 'NEW', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO work_order (site_id, customer_id, title, description, priority, status, created_at, updated_at) VALUES
(3, 2, 'Server Maintenance', 'Update server software', 'HIGH', 'ASSIGNED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO work_order (site_id, customer_id, title, description, priority, status, created_at, updated_at) VALUES
(3, 2, 'Network Check', 'Verify network connectivity', 'LOW', 'NEW', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO work_order (site_id, customer_id, title, description, priority, status, created_at, updated_at) VALUES
(4, 3, 'Building Inspection', 'Annual safety inspection', 'MEDIUM', 'NEW', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
