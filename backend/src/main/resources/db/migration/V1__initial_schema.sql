-- Create app_user table
CREATE TABLE app_user (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create customer table
CREATE TABLE customer (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create site table
CREATE TABLE site (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_site_customer FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
);

-- Create work_order table
CREATE TABLE work_order (
    id BIGSERIAL PRIMARY KEY,
    work_order_code VARCHAR(50) NOT NULL UNIQUE,
    site_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    assignee_id BIGINT,
    sla_due_date TIMESTAMP,
    total_parts_cost NUMERIC(19,2) DEFAULT 0,
    total_time_minutes BIGINT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_work_order_site FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE,
    CONSTRAINT fk_work_order_customer FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
    CONSTRAINT fk_work_order_assignee FOREIGN KEY (assignee_id) REFERENCES app_user(id) ON DELETE SET NULL
);

-- Create work_order_status_history table
CREATE TABLE work_order_status_history (
    id BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    from_status VARCHAR(50) NOT NULL,
    to_status VARCHAR(50) NOT NULL,
    changed_by_id BIGINT NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note TEXT,
    CONSTRAINT fk_history_work_order FOREIGN KEY (work_order_id) REFERENCES work_order(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_changed_by FOREIGN KEY (changed_by_id) REFERENCES app_user(id) ON DELETE RESTRICT
);

-- Create part table
CREATE TABLE part (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(255) NOT NULL UNIQUE,
    unit_cost NUMERIC(19,2) NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create part_usage table
CREATE TABLE part_usage (
    id BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    part_id BIGINT NOT NULL,
    quantity_used INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_part_usage_work_order FOREIGN KEY (work_order_id) REFERENCES work_order(id) ON DELETE CASCADE,
    CONSTRAINT fk_part_usage_part FOREIGN KEY (part_id) REFERENCES part(id) ON DELETE RESTRICT
);

-- Create time_log table
CREATE TABLE time_log (
    id BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    technician_id BIGINT NOT NULL,
    minutes_spent BIGINT NOT NULL,
    note TEXT,
    logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_time_log_work_order FOREIGN KEY (work_order_id) REFERENCES work_order(id) ON DELETE CASCADE,
    CONSTRAINT fk_time_log_technician FOREIGN KEY (technician_id) REFERENCES app_user(id) ON DELETE RESTRICT
);

-- Create notification table
CREATE TABLE notification (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_app_user_email ON app_user(email);
CREATE INDEX idx_customer_contact_email ON customer(contact_email);
CREATE INDEX idx_site_customer_id ON site(customer_id);
CREATE INDEX idx_work_order_site_id ON work_order(site_id);
CREATE INDEX idx_work_order_customer_id ON work_order(customer_id);
CREATE INDEX idx_work_order_assignee_id ON work_order(assignee_id);
CREATE INDEX idx_work_order_status ON work_order(status);
CREATE INDEX idx_work_order_priority ON work_order(priority);
CREATE INDEX idx_work_order_created_at ON work_order(created_at);
CREATE INDEX idx_work_order_status_history_work_order_id ON work_order_status_history(work_order_id);
CREATE INDEX idx_part_usage_work_order_id ON part_usage(work_order_id);
CREATE INDEX idx_part_usage_part_id ON part_usage(part_id);
CREATE INDEX idx_time_log_work_order_id ON time_log(work_order_id);
CREATE INDEX idx_time_log_technician_id ON time_log(technician_id);
CREATE INDEX idx_notification_user_id ON notification(user_id);
CREATE INDEX idx_notification_is_read ON notification(is_read);
