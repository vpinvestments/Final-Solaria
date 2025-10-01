-- Create watchlist tables for Solaria World
CREATE TABLE IF NOT EXISTS watchlist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  coin_id TEXT NOT NULL,
  coin_name TEXT NOT NULL,
  coin_symbol TEXT NOT NULL,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  added_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, coin_id)
);

CREATE TABLE IF NOT EXISTS price_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  coin_id TEXT NOT NULL,
  coin_name TEXT NOT NULL,
  coin_symbol TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('price_above', 'price_below', 'volume_above', 'market_cap_above')),
  target_value REAL NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_triggered BOOLEAN DEFAULT FALSE,
  triggered_date DATETIME NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_coin_id ON watchlist_items(coin_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_coin_id ON price_alerts(coin_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON price_alerts(is_active);

-- Insert some demo watchlist items for the demo user
INSERT OR IGNORE INTO watchlist_items (user_id, coin_id, coin_name, coin_symbol, notes, is_favorite) VALUES
(1, 'cardano', 'Cardano', 'ADA', 'Potential breakout candidate', FALSE),
(1, 'polygon', 'Polygon', 'MATIC', 'Layer 2 scaling solution', TRUE),
(1, 'chainlink', 'Chainlink', 'LINK', 'Oracle network leader', FALSE),
(1, 'avalanche', 'Avalanche', 'AVAX', 'High-performance blockchain', FALSE);

-- Insert some demo alerts for the demo user
INSERT OR IGNORE INTO price_alerts (user_id, coin_id, coin_name, coin_symbol, alert_type, target_value) VALUES
(1, 'cardano', 'Cardano', 'ADA', 'price_above', 0.5),
(1, 'cardano', 'Cardano', 'ADA', 'volume_above', 300000000),
(1, 'polygon', 'Polygon', 'MATIC', 'price_below', 0.8),
(1, 'chainlink', 'Chainlink', 'LINK', 'price_above', 15.0),
(1, 'avalanche', 'Avalanche', 'AVAX', 'price_below', 35.0);
