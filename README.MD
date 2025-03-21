# hypothetically

Online games portal for friends!

---

## SQL queries for creating tables

### `categories` table
```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_by VARCHAR,
    category TEXT NOT NULL,
    items VARCHAR NOT NULL
);
```

### `questions` table
```sql
CREATE TABLE questions (
    id BIGINT PRIMARY KEY NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    question VARCHAR NOT NULL UNIQUE,
    submitted_by VARCHAR NOT NULL
);
```

### `things` table
```sql
CREATE TABLE things (
    id BIGINT PRIMARY KEY NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    thing VARCHAR NOT NULL UNIQUE,
    submitted_by VARCHAR NOT NULL
);
```

### `sessions` table
```sql
CREATE TABLE sessions (
    id BIGINT PRIMARY KEY NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    session_id TEXT NOT NULL UNIQUE,
    data JSON
);
```

### `users` table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login TIMESTAMPTZ NOT NULL DEFAULT now(),
    account_status VARCHAR,
    is_admin BOOLEAN NOT NULL,
    google_id VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    name VARCHAR,
    profile_picture VARCHAR,
    display_name VARCHAR
);
```
