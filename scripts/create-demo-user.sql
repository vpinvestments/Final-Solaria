-- Create demo user for testing
INSERT IGNORE INTO users (email, password, first_name, last_name, created_at)
VALUES (
    'demo@solariaworld.com',
    '$2a$12$LQv3c1yqBwEHxv03kpDOCOvRh6HlBGSBVhfKAFpsFEN9JOmLDI.HO', -- password: demo123
    'Demo',
    'User',
    NOW()
);
