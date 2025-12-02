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
FROM users WHERE email = 'admin';
