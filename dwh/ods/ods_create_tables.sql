-- ODS层：操作数据层 - 原始数据层
-- 从业务系统同步的原始数据，不做清洗，保持数据原貌

CREATE DATABASE IF NOT EXISTS ods_ecommerce;
USE ods_ecommerce;

-- 用户表（原始）
CREATE EXTERNAL TABLE IF NOT EXISTS ods_user (
    user_id STRING,
    user_name STRING,
    email STRING,
    phone STRING,
    gender STRING,
    age INT,
    address STRING,
    register_time STRING,
    last_login_time STRING,
    status STRING,
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS TEXTFILE
LOCATION '/ecommerce/ods/user';

-- 商品表（原始）
CREATE EXTERNAL TABLE IF NOT EXISTS ods_product (
    product_id STRING,
    product_name STRING,
    category_id STRING,
    category_name STRING,
    brand_id STRING,
    brand_name STRING,
    price DECIMAL(10,2),
    original_price DECIMAL(10,2),
    stock INT,
    sales_count INT,
    status STRING,
    create_time STRING,
    update_time STRING,
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS TEXTFILE
LOCATION '/ecommerce/ods/product';

-- 订单表（原始）
CREATE EXTERNAL TABLE IF NOT EXISTS ods_order (
    order_id STRING,
    user_id STRING,
    order_no STRING,
    total_amount DECIMAL(10,2),
    pay_amount DECIMAL(10,2),
    freight DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    pay_type STRING,
    order_status STRING,
    create_time STRING,
    pay_time STRING,
    ship_time STRING,
    complete_time STRING,
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS TEXTFILE
LOCATION '/ecommerce/ods/order';

-- 订单明细表（原始）
CREATE EXTERNAL TABLE IF NOT EXISTS ods_order_item (
    item_id STRING,
    order_id STRING,
    product_id STRING,
    product_name STRING,
    price DECIMAL(10,2),
    quantity INT,
    total_price DECIMAL(10,2),
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS TEXTFILE
LOCATION '/ecommerce/ods/order_item';

-- 支付记录表（原始）
CREATE EXTERNAL TABLE IF NOT EXISTS ods_payment (
    payment_id STRING,
    order_id STRING,
    user_id STRING,
    pay_no STRING,
    pay_amount DECIMAL(10,2),
    pay_type STRING,
    pay_status STRING,
    create_time STRING,
    complete_time STRING,
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS TEXTFILE
LOCATION '/ecommerce/ods/payment';

-- 商品分类表（原始）
CREATE EXTERNAL TABLE IF NOT EXISTS ods_category (
    category_id STRING,
    category_name STRING,
    parent_id STRING,
    level INT,
    sort INT,
    status STRING,
    create_time STRING,
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS TEXTFILE
LOCATION '/ecommerce/ods/category';
