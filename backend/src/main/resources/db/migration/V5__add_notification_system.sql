-- Notification Table
CREATE TABLE IF NOT EXISTS notification (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notification_user_id ON notification(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_is_read ON notification(is_read);

-- Work Order Comments
CREATE TABLE IF NOT EXISTS work_order_comment (
    id BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_order_id) REFERENCES work_order(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_work_order_comment_work_order_id ON work_order_comment(work_order_id);

-- Time Logs
CREATE TABLE IF NOT EXISTS time_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    work_order_id BIGINT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes INTEGER,
    log_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE,
    FOREIGN KEY (work_order_id) REFERENCES work_order(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_time_log_user_id ON time_log(user_id);
CREATE INDEX IF NOT EXISTS idx_time_log_work_order_id ON time_log(work_order_id);

-- Parts Usage
CREATE TABLE IF NOT EXISTS parts_used (
    id BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    part_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    used_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    added_by BIGINT,
    FOREIGN KEY (work_order_id) REFERENCES work_order(id) ON DELETE CASCADE,
    FOREIGN KEY (part_id) REFERENCES part(id) ON DELETE CASCADE,
    FOREIGN KEY (added_by) REFERENCES app_user(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_parts_used_work_order_id ON parts_used(work_order_id);

-- Work Order Photos
CREATE TABLE IF NOT EXISTS work_order_photo (
    id BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    photo_type VARCHAR(50),
    uploaded_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_order_id) REFERENCES work_order(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES app_user(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_work_order_photo_work_order_id ON work_order_photo(work_order_id);

-- Service Requests (Customer Portal)
CREATE TABLE IF NOT EXISTS service_request (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    site_id BIGINT,
    assigned_work_order_id BIGINT,
    requested_date DATE,
    preferred_time_window VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES app_user(id) ON DELETE CASCADE,
    FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_work_order_id) REFERENCES work_order(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_service_request_customer_id ON service_request(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_request_status ON service_request(status);

-- Technician Availability
CREATE TABLE IF NOT EXISTS technician_availability (
    id BIGSERIAL PRIMARY KEY,
    technician_id BIGINT NOT NULL,
    available_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT TRUE,
    notes VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (technician_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_technician_availability_technician_id ON technician_availability(technician_id);
CREATE INDEX IF NOT EXISTS idx_technician_availability_date ON technician_availability(available_date);

-- Invoice/Billing
CREATE TABLE IF NOT EXISTS invoice (
    id BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    invoice_number VARCHAR(100) UNIQUE,
    total_amount DECIMAL(10, 2),
    tax_amount DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'PENDING',
    issued_date TIMESTAMP,
    due_date DATE,
    paid_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_order_id) REFERENCES work_order(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_invoice_customer_id ON invoice(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoice_status ON invoice(status);

-- Rating/Review
CREATE TABLE IF NOT EXISTS work_order_rating (
    id BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_order_id) REFERENCES work_order(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_work_order_rating_work_order_id ON work_order_rating(work_order_id);
