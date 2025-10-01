-- Add OAuth fields to users table
ALTER TABLE users 
ADD COLUMN oauth_provider VARCHAR(50) NULL,
ADD COLUMN oauth_id VARCHAR(255) NULL,
ADD COLUMN avatar_url VARCHAR(500) NULL,
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
ADD INDEX idx_oauth_provider_id (oauth_provider, oauth_id);

-- Update existing users to have email_verified = TRUE
UPDATE users SET email_verified = TRUE WHERE oauth_provider IS NULL;
