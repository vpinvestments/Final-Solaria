-- Converting watchlist tables to MySQL syntax
CREATE TABLE IF NOT EXISTS watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  coin_id VARCHAR(100) NOT NULL,
  coin_name VARCHAR(255) NOT NULL,
  coin_symbol VARCHAR(20) NOT NULL,
  current_price DECIMAL(20, 8),
  price_change_24h DECIMAL(10, 4),
  market_cap BIGINT,
  volume_24h BIGINT,
  is_favorite BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_coin (user_id, coin_id),
  INDEX idx_user_id (user_id),
  INDEX idx_coin_id (coin_id),
  INDEX idx_is_favorite (is_favorite)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS watchlist_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  coin_id VARCHAR(100) NOT NULL,
  coin_symbol VARCHAR(20) NOT NULL,
  alert_type ENUM('price_above', 'price_below', 'percent_change') NOT NULL,
  target_value DECIMAL(20, 8) NOT NULL,
  current_value DECIMAL(20, 8),
  is_active BOOLEAN DEFAULT TRUE,
  is_triggered BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMP NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_coin_id (coin_id),
  INDEX idx_is_active (is_active),
  INDEX idx_is_triggered (is_triggered)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
