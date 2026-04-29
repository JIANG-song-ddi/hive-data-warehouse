-- 电商业务数据库初始化脚本

USE ecommerce;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    user_name VARCHAR(128) NOT NULL,
    email VARCHAR(128),
    phone VARCHAR(32),
    gender VARCHAR(8),
    age INT,
    address TEXT,
    register_time DATETIME,
    last_login_time DATETIME,
    status VARCHAR(16) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_register_time (register_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 商品分类表
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id VARCHAR(64) NOT NULL UNIQUE,
    category_name VARCHAR(128) NOT NULL,
    parent_id VARCHAR(64),
    level INT DEFAULT 1,
    sort INT DEFAULT 0,
    status VARCHAR(16) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_id (category_id),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 商品表
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL UNIQUE,
    product_name VARCHAR(256) NOT NULL,
    category_id VARCHAR(64),
    category_name VARCHAR(128),
    brand_id VARCHAR(64),
    brand_name VARCHAR(128),
    price DECIMAL(10,2) DEFAULT 0.00,
    original_price DECIMAL(10,2) DEFAULT 0.00,
    stock INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    status VARCHAR(16) DEFAULT 'active',
    create_time DATETIME,
    update_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL UNIQUE,
    order_no VARCHAR(64) NOT NULL UNIQUE,
    user_id VARCHAR(64) NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    pay_amount DECIMAL(10,2) DEFAULT 0.00,
    freight DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    pay_type VARCHAR(32),
    order_status VARCHAR(32) DEFAULT 'pending',
    create_time DATETIME,
    pay_time DATETIME,
    ship_time DATETIME,
    complete_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_order_status (order_status),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 订单明细表
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id VARCHAR(64) NOT NULL UNIQUE,
    order_id VARCHAR(64) NOT NULL,
    product_id VARCHAR(64) NOT NULL,
    product_name VARCHAR(256),
    price DECIMAL(10,2) DEFAULT 0.00,
    quantity INT DEFAULT 1,
    total_price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_item_id (item_id),
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 支付记录表
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id VARCHAR(64) NOT NULL UNIQUE,
    order_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    pay_no VARCHAR(128),
    pay_amount DECIMAL(10,2) DEFAULT 0.00,
    pay_type VARCHAR(32),
    pay_status VARCHAR(32) DEFAULT 'pending',
    create_time DATETIME,
    complete_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_payment_id (payment_id),
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_pay_status (pay_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 数据导入任务表
CREATE TABLE IF NOT EXISTS data_import_tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id VARCHAR(64) NOT NULL UNIQUE,
    task_name VARCHAR(128) NOT NULL,
    table_name VARCHAR(64) NOT NULL,
    file_path VARCHAR(256),
    status VARCHAR(32) DEFAULT 'pending',
    total_rows BIGINT DEFAULT 0,
    success_rows BIGINT DEFAULT 0,
    failed_rows BIGINT DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_task_id (task_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ETL任务执行记录表
CREATE TABLE IF NOT EXISTS etl_task_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_name VARCHAR(128) NOT NULL,
    task_type VARCHAR(64) NOT NULL,
    dt VARCHAR(16) NOT NULL,
    status VARCHAR(32) DEFAULT 'running',
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    duration_seconds INT DEFAULT 0,
    records_processed BIGINT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_task_name (task_name),
    INDEX idx_dt (dt),
    INDEX idx_status (status),
    INDEX idx_start_time (start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
