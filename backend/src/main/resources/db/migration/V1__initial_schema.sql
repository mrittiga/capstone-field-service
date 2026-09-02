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

-- Create index on email for faster lookups
CREATE INDEX idx_app_user_email ON app_user(email);

-- Create customer table
CREATE TABLE customer (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create site table
CREATE TABLE site (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
);

CREATE INDEX idx_site_customer_id ON site(customer_id);

-- Create work_order table
CREATE TABLE work_order (
    id BIGSERIAL PRIMARY KEY,
    site_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    assignee_id BIGINT,
    sla_due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES app_user(id) ON DELETE SET NULL
);

CREATE INDEX idx_work_order_status ON work_order(status);
CREATE INDEX idx_work_order_assignee_id ON work_order(assignee_id);
CREATE INDEX idx_work_order_customer_id ON work_order(customer_id);
CREATE INDEX idx_work_order_sla_due_date ON work_order(sla_due_date);

-- Create work_order_status_history table
CREATE TABLE work_order_status_history (
    id BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    changed_by_id BIGINT,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note TEXT,
    FOREIGN KEY (work_order_id) REFERENCES work_order(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by_id) REFERENCES app_user(id) ON DELETE SET NULL
);

CREATE INDEX idx_work_order_status_history_work_order_id ON work_order_status_history(work_order_id);

-- Create part table
CREATE TABLE part (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    unit_cost DECIMAL(10, 2) NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_part_sku ON part(sku);

-- Create part_usage table
CREATE TABLE part_usage (
    id BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    part_id BIGINT NOT NULL,
    quantity_used INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_order_id) REFERENCES work_order(id) ON DELETE CASCADE,
    FOREIGN KEY (part_id) REFERENCES part(id) ON DELETE RESTRICT
);

CREATE INDEX idx_part_usage_work_order_id ON part_usage(work_order_id);

-- Create time_log table
CREATE TABLE time_log (
    id BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    technician_id BIGINT NOT NULL,
    minutes_spent INTEGER NOT NULL,
    note TEXT,
    logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_order_id) REFERENCES work_order(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES app_user(id) ON DELETE RESTRICT
);

CREATE INDEX idx_time_log_work_order_id ON time_log(work_order_id);

-- Create notification table
CREATE TABLE notification (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE INDEX idx_notification_user_id ON notification(user_id);
