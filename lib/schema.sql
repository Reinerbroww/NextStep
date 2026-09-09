-- NextStep Database Schema (PostgreSQL / Neon)
-- Source of truth: docs/coldstart.md and docs/databaseschema..md

CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    input_text TEXT NOT NULL,

    input_type VARCHAR(20) NOT NULL
        CHECK (input_type IN ('text', 'voice')),

    ai_context TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE goals (
    id UUID PRIMARY KEY,
    session_id UUID NOT NULL,
    goal_text TEXT NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'completed', 'archived')),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id)
        REFERENCES sessions(id)
        ON DELETE CASCADE
);

CREATE TABLE action_plans (
    id UUID PRIMARY KEY,
    goal_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,

    step_order INTEGER NOT NULL
        CHECK (step_order > 0),

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'in_progress', 'completed')),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (goal_id)
        REFERENCES goals(id)
        ON DELETE CASCADE
);

CREATE TABLE progress (
    id UUID PRIMARY KEY,
    action_plan_id UUID NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed')),

    completed_at TIMESTAMP,

    FOREIGN KEY (action_plan_id)
        REFERENCES action_plans(id)
        ON DELETE CASCADE
);
