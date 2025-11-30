-- ================================================
-- 0. REQUIRED EXTENSIONS
-- ================================================
CREATE EXTENSION IF NOT EXISTS citus;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ================================================
-- 1. DROP FOREIGN KEYS
-- ================================================
ALTER TABLE IF EXISTS order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE IF EXISTS payments DROP CONSTRAINT IF EXISTS payments_order_id_fkey;
ALTER TABLE IF EXISTS payments DROP CONSTRAINT IF EXISTS payments_customer_id_fkey;
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;
ALTER TABLE IF EXISTS customers DROP CONSTRAINT IF EXISTS customers_user_id_fkey;

-- ================================================
-- 2. DROP PRIMARY KEYS
-- ================================================
ALTER TABLE IF EXISTS customers DROP CONSTRAINT IF EXISTS customers_pkey CASCADE;
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS orders_pkey CASCADE;
ALTER TABLE IF EXISTS payments DROP CONSTRAINT IF EXISTS payments_pkey CASCADE;
ALTER TABLE IF EXISTS order_items DROP CONSTRAINT IF EXISTS order_items_pkey CASCADE;

-- ================================================
-- 3. RECREATE PRIMARY KEYS (VALID FOR CITUS)
-- ================================================
-- distribution key: customer_id
ALTER TABLE customers ADD PRIMARY KEY (customer_id);

-- distribution key: customer_id → must be included in PK
ALTER TABLE orders ADD PRIMARY KEY (order_id, customer_id);

-- distribution key: customer_id → must be included in PK
ALTER TABLE payments ADD PRIMARY KEY (payment_id, customer_id);

-- distribution key: order_id → must be included in PK
ALTER TABLE order_items ADD PRIMARY KEY (order_item_id, order_id);

-- ================================================
-- 4. REFERENCE TABLES
-- ================================================
SELECT create_reference_table('users');
SELECT create_reference_table('products');

-- ================================================
-- 5. DISTRIBUTE TABLES
-- ================================================
SELECT create_distributed_table('customers', 'customer_id');
SELECT create_distributed_table('orders', 'customer_id');
SELECT create_distributed_table('payments', 'customer_id');
SELECT create_distributed_table('order_items', 'order_id');

-- ================================================
-- 6. RE-ADD FOREIGN KEYS (VALID IN CITUS)
-- ================================================
-- users is a reference table → FK allowed
ALTER TABLE customers
  ADD CONSTRAINT customers_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES users(user_id)
  ON DELETE SET NULL;

-- orders → customers (same distribution key) → VALID
ALTER TABLE orders
  ADD CONSTRAINT orders_customer_id_fkey
  FOREIGN KEY (customer_id)
  REFERENCES customers(customer_id);

-- payments → customers (same distribution key) → VALID
ALTER TABLE payments
  ADD CONSTRAINT payments_customer_id_fkey
  FOREIGN KEY (customer_id)
  REFERENCES customers(customer_id);

-- payments → orders must include FULL PK (order_id, customer_id)
ALTER TABLE payments
  ADD CONSTRAINT payments_order_id_fkey
  FOREIGN KEY (order_id, customer_id)
  REFERENCES orders(order_id, customer_id);

-- order_items must store customer_id too
ALTER TABLE order_items 
  ADD COLUMN IF NOT EXISTS customer_id uuid;

UPDATE order_items oi
SET customer_id = o.customer_id
FROM orders o
WHERE oi.order_id = o.order_id;



-- populate customer_id automatically
UPDATE order_items oi
SET customer_id = o.customer_id
FROM orders o
WHERE oi.order_id = o.order_id;

-- enforce full FK

ALTER TABLE order_items
  ADD CONSTRAINT order_items_order_id_fkey
  FOREIGN KEY (order_id, customer_id)
  REFERENCES orders(order_id, customer_id);

-- ================================================
-- 7. REBALANCE SHARDS (ONLY DISTRIBUTED TABLES)
-- ================================================
SELECT rebalance_table_shards('customers');
SELECT rebalance_table_shards('orders');
SELECT rebalance_table_shards('payments');
SELECT rebalance_table_shards('order_items');

-- DO NOT rebalance reference tables (users, products)

-- Done
