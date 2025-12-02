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

-- Enums for tasks
CREATE TYPE tasks_status_enum AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
CREATE TYPE tasks_priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE TABLE tasks (
    -- primary keys
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    -- metadata
    "description" TEXT,
    "status" tasks_status_enum NOT NULL DEFAULT 'TODO',
    "priority" tasks_priority_enum NOT NULL DEFAULT 'MEDIUM',
    -- foreign keys
    "assigneeId" UUID REFERENCES users("id"),
    -- audit
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "modifiedAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- Indexes for tasks table
CREATE INDEX idx_tasks_status ON tasks("status") WHERE deleted = false;
CREATE INDEX idx_tasks_priority ON tasks("priority") WHERE deleted = false;
CREATE INDEX idx_tasks_assignee ON tasks("assigneeId") WHERE deleted = false;

-- Insert sample tasks
INSERT INTO tasks ("title", "description", "status", "priority", "assigneeId")
SELECT
    'Task ' || i,
    CASE WHEN random() > 0.3 THEN 'Description for task ' || i ELSE NULL END,
    (ARRAY['TODO', 'IN_PROGRESS', 'DONE']::tasks_status_enum[])[1 + floor(random() * 3)::int],
    (ARRAY['LOW', 'MEDIUM', 'HIGH']::tasks_priority_enum[])[1 + floor(random() * 3)::int],
    CASE WHEN random() > 0.5 THEN (SELECT id FROM users WHERE email = 'admin@gmail.com') ELSE NULL END
FROM generate_series(1, 10) AS i;
