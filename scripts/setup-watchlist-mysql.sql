-- Create watchlist tables for MySQL
CREATE TABLE IF NOT EXISTS watchlist_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  coin_id VARCHAR(100) NOT NULL,
  coin_name VARCHAR(255) NOT NULL,
  coin_symbol VARCHAR(20) NOT NULL,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_coin (user_id, coin_id),
  INDEX idx_user_id (user_id),
  INDEX idx_coin_id (coin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS price_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  coin_id VARCHAR(100) NOT NULL,
  coin_name VARCHAR(255) NOT NULL,
  coin_symbol VARCHAR(20) NOT NULL,
  alert_type ENUM('price_above', 'price_below', 'volume_above', 'market_cap_above') NOT NULL,
  target_value DECIMAL(20, 8) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_triggered BOOLEAN DEFAULT FALSE,
  triggered_date TIMESTAMP NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_coin_id (coin_id),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert demo watchlist items for the demo user
INSERT IGNORE INTO watchlist_items (user_id, coin_id, coin_name, coin_symbol, notes, is_favorite) VALUES
('1', 'cardano', 'Cardano', 'ADA', 'Potential breakout candidate', FALSE),
('1', 'polygon', 'Polygon', 'MATIC', 'Layer 2 scaling solution', TRUE),
('1', 'chainlink', 'Chainlink', 'LINK', 'Oracle network leader', FALSE),
('1', 'avalanche', 'Avalanche', 'AVAX', 'High-performance blockchain', FALSE);

-- Insert demo alerts for the demo user
INSERT IGNORE INTO price_alerts (user_id, coin_id, coin_name, coin_symbol, alert_type, target_value) VALUES
('1', 'cardano', 'Cardano', 'ADA', 'price_above', 0.5),
('1', 'polygon', 'Polygon', 'MATIC', 'price_below', 0.8),
('1', 'chainlink', 'Chainlink', 'LINK', 'price_above', 15.0),
('1', 'avalanche', 'Avalanche', 'AVAX', 'price_below', 35.0);
