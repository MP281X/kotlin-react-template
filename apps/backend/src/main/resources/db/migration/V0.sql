-- Enums for users
CREATE TYPE users_role_enum AS ENUM ('USER', 'ADMIN');

CREATE TABLE users (
    -- primary keys
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    -- metadata
    "password" TEXT NOT NULL,
    "role" users_role_enum NOT NULL DEFAULT 'USER',
    -- audit
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "modifiedAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- Unique index for users (non dismissed)
CREATE UNIQUE INDEX idx_users_unique_email ON users("email") WHERE deleted = false;

-- Insert default admin user (password: admin)
INSERT INTO users (email, password, role)
VALUES ('admin@gmail.com', '$2a$10$waFBULOPfB/vZ0uMqv90IOOSk136xhXHECsOsA8jCqayy2FUmbUru', 'ADMIN');

CREATE TABLE audits (
    -- primary keys
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- metadata
    "message" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "result" JSONB,
    -- foreign keys
    "userId" UUID REFERENCES users("id"),
    "timestamp" TIMESTAMP NOT NULL DEFAULT now()
);

-- Indexes for audits table
CREATE INDEX idx_audits_timestamp ON audits("timestamp" DESC);

-- Insert sample audit entries
INSERT INTO audits ("message", "payload", "result", "userId", "timestamp")
SELECT
    'createUser',
    '{"email": "admin", "role": "ADMIN"}'::jsonb,
    jsonb_build_object('id', id, 'email', email, 'role', role),
    id,
    "createdAt"
FROM users WHERE email = 'admin@gmail.com';

-- Generate many audit logs for testing virtualization
INSERT INTO audits ("message", "payload", "result", "userId", "timestamp")
SELECT
    (ARRAY['login', 'logout', 'updateProfile', 'changePassword', 'viewDashboard', 'exportData', 'importData', 'deleteRecord', 'createRecord', 'updateRecord'])[1 + floor(random() * 10)::int],
    jsonb_build_object(
        'ip', '192.168.' || floor(random() * 255)::int || '.' || floor(random() * 255)::int,
        'userAgent', (ARRAY['Chrome/120', 'Firefox/121', 'Safari/17', 'Edge/120'])[1 + floor(random() * 4)::int],
        'requestId', gen_random_uuid()
    ),
    CASE WHEN random() > 0.1 THEN jsonb_build_object('success', true) ELSE jsonb_build_object('success', false, 'error', 'Operation failed') END,
    (SELECT id FROM users WHERE email = 'admin@gmail.com'),
    now() - (random() * interval '30 days')
FROM generate_series(1, 1000);
