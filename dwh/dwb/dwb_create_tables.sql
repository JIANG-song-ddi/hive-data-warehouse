-- DWB层：基础数据层
-- 轻度聚合，构建通用的宽表，为DM层提供基础

CREATE DATABASE IF NOT EXISTS dwb_ecommerce;
USE dwb_ecommerce;

-- 订单宽表（星型模型事实表）
CREATE EXTERNAL TABLE IF NOT EXISTS dwb_order_wide (
    order_id STRING COMMENT '订单ID',
    order_no STRING COMMENT '订单号',
    user_id STRING COMMENT '用户ID',
    user_name STRING COMMENT '用户名',
    gender STRING COMMENT '性别',
    age INT COMMENT '年龄',
    age_group STRING COMMENT '年龄段',
    province STRING COMMENT '省份',
    city STRING COMMENT '城市',
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
    is_paid INT COMMENT '是否已支付',
    is_completed INT COMMENT '是否已完成',
    year INT COMMENT '年',
    quarter INT COMMENT '季度',
    month INT COMMENT '月',
    week INT COMMENT '周',
    day INT COMMENT '日',
    day_of_week INT COMMENT '星期几',
    is_weekend INT COMMENT '是否周末',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dwb/order_wide'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

-- 商品销售宽表
CREATE EXTERNAL TABLE IF NOT EXISTS dwb_product_sales_wide (
    item_id STRING COMMENT '明细ID',
    order_id STRING COMMENT '订单ID',
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
    quantity INT COMMENT '数量',
    total_price DECIMAL(10,2) COMMENT '小计',
    user_id STRING COMMENT '用户ID',
    age_group STRING COMMENT '年龄段',
    province STRING COMMENT '省份',
    city STRING COMMENT '城市',
    create_date STRING COMMENT '创建日期',
    create_hour INT COMMENT '创建小时',
    year INT COMMENT '年',
    quarter INT COMMENT '季度',
    month INT COMMENT '月',
    week INT COMMENT '周',
    day_of_week INT COMMENT '星期几',
    is_weekend INT COMMENT '是否周末',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dwb/product_sales_wide'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

-- 用户行为宽表
CREATE EXTERNAL TABLE IF NOT EXISTS dwb_user_behavior_wide (
    user_id STRING COMMENT '用户ID',
    user_name STRING COMMENT '用户名',
    gender STRING COMMENT '性别',
    age INT COMMENT '年龄',
    age_group STRING COMMENT '年龄段',
    province STRING COMMENT '省份',
    city STRING COMMENT '城市',
    register_date STRING COMMENT '注册日期',
    last_login_time TIMESTAMP COMMENT '最后登录时间',
    status STRING COMMENT '状态',
    is_active INT COMMENT '是否活跃',
    total_orders INT COMMENT '总订单数',
    total_amount DECIMAL(10,2) COMMENT '总消费金额',
    avg_order_amount DECIMAL(10,2) COMMENT '平均订单金额',
    first_order_date STRING COMMENT '首单日期',
    last_order_date STRING COMMENT '最近订单日期',
    order_count_30d INT COMMENT '近30天订单数',
    amount_30d DECIMAL(10,2) COMMENT '近30天消费金额',
    user_level STRING COMMENT '用户等级',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dwb/user_behavior_wide'
TBLPROPERTIES ('parquet.compression'='SNAPPY');
