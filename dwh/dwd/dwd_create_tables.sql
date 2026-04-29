-- DWD层：明细数据层
-- 对ODS层数据进行清洗、标准化、脱敏处理

CREATE DATABASE IF NOT EXISTS dwd_ecommerce;
USE dwd_ecommerce;

-- 用户维度表
CREATE EXTERNAL TABLE IF NOT EXISTS dwd_user_dim (
    user_id STRING COMMENT '用户ID',
    user_name STRING COMMENT '用户名',
    email STRING COMMENT '邮箱',
    phone STRING COMMENT '手机号',
    gender STRING COMMENT '性别',
    age INT COMMENT '年龄',
    age_group STRING COMMENT '年龄段',
    address STRING COMMENT '地址',
    province STRING COMMENT '省份',
    city STRING COMMENT '城市',
    register_time TIMESTAMP COMMENT '注册时间',
    register_date STRING COMMENT '注册日期',
    last_login_time TIMESTAMP COMMENT '最后登录时间',
    status STRING COMMENT '状态',
    is_active INT COMMENT '是否活跃',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dwd/user_dim'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

-- 商品维度表
CREATE EXTERNAL TABLE IF NOT EXISTS dwd_product_dim (
    product_id STRING COMMENT '商品ID',
    product_name STRING COMMENT '商品名称',
    category_id STRING COMMENT '分类ID',
    category_name STRING COMMENT '分类名称',
    category_level1_id STRING COMMENT '一级分类ID',
    category_level1_name STRING COMMENT '一级分类名称',
    category_level2_id STRING COMMENT '二级分类ID',
    category_level2_name STRING COMMENT '二级分类名称',
    brand_id STRING COMMENT '品牌ID',
    brand_name STRING COMMENT '品牌名称',
    price DECIMAL(10,2) COMMENT '售价',
    original_price DECIMAL(10,2) COMMENT '原价',
    discount_rate DECIMAL(5,4) COMMENT '折扣率',
    price_range STRING COMMENT '价格区间',
    stock INT COMMENT '库存',
    sales_count INT COMMENT '销量',
    status STRING COMMENT '状态',
    is_on_sale INT COMMENT '是否在售',
    create_time TIMESTAMP COMMENT '创建时间',
    create_date STRING COMMENT '创建日期',
    update_time TIMESTAMP COMMENT '更新时间',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dwd/product_dim'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

-- 订单事实表
CREATE EXTERNAL TABLE IF NOT EXISTS dwd_order_fact (
    order_id STRING COMMENT '订单ID',
    order_no STRING COMMENT '订单号',
    user_id STRING COMMENT '用户ID',
    total_amount DECIMAL(10,2) COMMENT '订单总额',
    pay_amount DECIMAL(10,2) COMMENT '实付金额',
    freight DECIMAL(10,2) COMMENT '运费',
    discount_amount DECIMAL(10,2) COMMENT '优惠金额',
    pay_type STRING COMMENT '支付方式',
    order_status STRING COMMENT '订单状态',
    create_time TIMESTAMP COMMENT '创建时间',
    create_date STRING COMMENT '创建日期',
    create_hour INT COMMENT '创建小时',
    pay_time TIMESTAMP COMMENT '支付时间',
    pay_date STRING COMMENT '支付日期',
    ship_time TIMESTAMP COMMENT '发货时间',
    complete_time TIMESTAMP COMMENT '完成时间',
    is_paid INT COMMENT '是否已支付',
    is_shipped INT COMMENT '是否已发货',
    is_completed INT COMMENT '是否已完成',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dwd/order_fact'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

-- 订单明细事实表
CREATE EXTERNAL TABLE IF NOT EXISTS dwd_order_item_fact (
    item_id STRING COMMENT '明细ID',
    order_id STRING COMMENT '订单ID',
    product_id STRING COMMENT '商品ID',
    product_name STRING COMMENT '商品名称',
    price DECIMAL(10,2) COMMENT '单价',
    quantity INT COMMENT '数量',
    total_price DECIMAL(10,2) COMMENT '小计',
    create_time TIMESTAMP COMMENT '创建时间',
    create_date STRING COMMENT '创建日期',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dwd/order_item_fact'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

-- 支付事实表
CREATE EXTERNAL TABLE IF NOT EXISTS dwd_payment_fact (
    payment_id STRING COMMENT '支付ID',
    order_id STRING COMMENT '订单ID',
    user_id STRING COMMENT '用户ID',
    pay_no STRING COMMENT '支付流水号',
    pay_amount DECIMAL(10,2) COMMENT '支付金额',
    pay_type STRING COMMENT '支付方式',
    pay_status STRING COMMENT '支付状态',
    create_time TIMESTAMP COMMENT '创建时间',
    create_date STRING COMMENT '创建日期',
    complete_time TIMESTAMP COMMENT '完成时间',
    is_success INT COMMENT '是否成功',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dwd/payment_fact'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

-- 日期维度表
CREATE EXTERNAL TABLE IF NOT EXISTS dwd_date_dim (
    date_id STRING COMMENT '日期ID',
    full_date DATE COMMENT '完整日期',
    year INT COMMENT '年',
    quarter INT COMMENT '季度',
    month INT COMMENT '月',
    week INT COMMENT '周',
    day INT COMMENT '日',
    day_of_week INT COMMENT '星期几',
    day_name STRING COMMENT '星期名称',
    is_weekend INT COMMENT '是否周末',
    is_holiday INT COMMENT '是否节假日',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dwd/date_dim'
TBLPROPERTIES ('parquet.compression'='SNAPPY');
