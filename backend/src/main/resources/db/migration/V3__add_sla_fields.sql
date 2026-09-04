-- This migration is here for reference if you need to add additional SLA tracking fields
-- Currently, sla_due_date is already in V1

-- You can add SLA history tracking if needed in the future
-- For now, this file serves as a placeholder for future SLA enhancements

-- Example for future use:
-- CREATE TABLE sla_breach_history (
--     id BIGSERIAL PRIMARY KEY,
--     work_order_id BIGINT NOT NULL,
--     breach_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT fk_breach_work_order FOREIGN KEY (work_order_id) REFERENCES work_order(id) ON DELETE CASCADE
-- );
