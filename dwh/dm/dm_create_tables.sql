-- DM层：数据集市层
-- 面向业务主题的高度聚合，支撑报表和多维分析

CREATE DATABASE IF NOT EXISTS dm_ecommerce;
USE dm_ecommerce;

-- ==================== 销售主题 ====================
-- 销售概览表
CREATE EXTERNAL TABLE IF NOT EXISTS dm_sales_overview (
    stat_date STRING COMMENT '统计日期',
    stat_type STRING COMMENT '统计类型：day/week/month/quarter/year',
    order_count BIGINT COMMENT '订单数',
    user_count BIGINT COMMENT '下单用户数',
    product_count BIGINT COMMENT '销售商品数',
    total_amount DECIMAL(14,2) COMMENT '销售总额',
    pay_amount DECIMAL(14,2) COMMENT '实付总额',
    avg_order_amount DECIMAL(10,2) COMMENT '平均订单金额',
    avg_user_spend DECIMAL(10,2) COMMENT '人均消费',
    order_completion_rate DECIMAL(5,4) COMMENT '订单完成率',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dm/sales_overview'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

-- 商品销售统计表
CREATE EXTERNAL TABLE IF NOT EXISTS dm_product_sales (
    stat_date STRING COMMENT '统计日期',
    stat_type STRING COMMENT '统计类型：day/week/month',
    product_id STRING COMMENT '商品ID',
    product_name STRING COMMENT '商品名称',
    category_level1_id STRING COMMENT '一级分类ID',
    category_level1_name STRING COMMENT '一级分类名称',
    category_level2_id STRING COMMENT '二级分类ID',
    category_level2_name STRING COMMENT '二级分类名称',
    brand_id STRING COMMENT '品牌ID',
    brand_name STRING COMMENT '品牌名称',
    price_range STRING COMMENT '价格区间',
    sales_quantity BIGINT COMMENT '销售数量',
    sales_amount DECIMAL(14,2) COMMENT '销售金额',
    order_count BIGINT COMMENT '订单数',
    user_count BIGINT COMMENT '购买用户数',
    rank_category INT COMMENT '分类内排名',
    rank_total INT COMMENT '总排名',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dm/product_sales'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

-- 分类销售统计表
CREATE EXTERNAL TABLE IF NOT EXISTS dm_category_sales (
    stat_date STRING COMMENT '统计日期',
    stat_type STRING COMMENT '统计类型：day/week/month',
    category_id STRING COMMENT '分类ID',
    category_name STRING COMMENT '分类名称',
    category_level INT COMMENT '分类层级',
    parent_id STRING COMMENT '父分类ID',
    product_count BIGINT COMMENT '商品数',
    sales_quantity BIGINT COMMENT '销售数量',
    sales_amount DECIMAL(14,2) COMMENT '销售金额',
    order_count BIGINT COMMENT '订单数',
    user_count BIGINT COMMENT '购买用户数',
    avg_price DECIMAL(10,2) COMMENT '平均单价',
    sales_ratio DECIMAL(5,4) COMMENT '销售占比',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dm/category_sales'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

-- ==================== 用户主题 ====================
-- 用户统计概览
CREATE EXTERNAL TABLE IF NOT EXISTS dm_user_overview (
    stat_date STRING COMMENT '统计日期',
    stat_type STRING COMMENT '统计类型：day/week/month',
    total_users BIGINT COMMENT '总用户数',
    new_users BIGINT COMMENT '新增用户数',
    active_users BIGINT COMMENT '活跃用户数',
    paid_users BIGINT COMMENT '付费用户数',
    new_paid_users BIGINT COMMENT '新增付费用户数',
    user_conversion_rate DECIMAL(5,4) COMMENT '用户转化率',
    paid_conversion_rate DECIMAL(5,4) COMMENT '付费转化率',
    arpu DECIMAL(10,2) COMMENT '每用户平均收入',
    arppu DECIMAL(10,2) COMMENT '每付费用户平均收入',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dm/user_overview'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

-- 用户分层统计表
CREATE EXTERNAL TABLE IF NOT EXISTS dm_user_segment (
    stat_date STRING COMMENT '统计日期',
    user_level STRING COMMENT '用户等级',
    age_group STRING COMMENT '年龄段',
    gender STRING COMMENT '性别',
    province STRING COMMENT '省份',
    city STRING COMMENT '城市',
    user_count BIGINT COMMENT '用户数',
    user_ratio DECIMAL(5,4) COMMENT '用户占比',
    total_orders BIGINT COMMENT '总订单数',
    total_amount DECIMAL(14,2) COMMENT '总消费金额',
    avg_order_amount DECIMAL(10,2) COMMENT '平均订单金额',
    avg_user_spend DECIMAL(10,2) COMMENT '人均消费',
    order_frequency DECIMAL(10,2) COMMENT '下单频次',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dm/user_segment'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

-- 用户留存表
CREATE EXTERNAL TABLE IF NOT EXISTS dm_user_retention (
    stat_date STRING COMMENT '统计日期',
    register_date STRING COMMENT '注册日期',
    cohort_size BIGINT COMMENT '同期群人数',
    retention_1d BIGINT COMMENT '次日留存',
    retention_7d BIGINT COMMENT '7日留存',
    retention_14d BIGINT COMMENT '14日留存',
    retention_30d BIGINT COMMENT '30日留存',
    retention_rate_1d DECIMAL(5,4) COMMENT '次日留存率',
    retention_rate_7d DECIMAL(5,4) COMMENT '7日留存率',
    retention_rate_14d DECIMAL(5,4) COMMENT '14日留存率',
    retention_rate_30d DECIMAL(5,4) COMMENT '30日留存率',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dm/user_retention'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

-- ==================== 渠道主题 ====================
-- 支付方式统计表
CREATE EXTERNAL TABLE IF NOT EXISTS dm_payment_stats (
    stat_date STRING COMMENT '统计日期',
    stat_type STRING COMMENT '统计类型：day/week/month',
    pay_type STRING COMMENT '支付方式',
    order_count BIGINT COMMENT '订单数',
    order_ratio DECIMAL(5,4) COMMENT '订单占比',
    pay_amount DECIMAL(14,2) COMMENT '支付金额',
    amount_ratio DECIMAL(5,4) COMMENT '金额占比',
    user_count BIGINT COMMENT '用户数',
    avg_order_amount DECIMAL(10,2) COMMENT '平均订单金额',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dm/payment_stats'
TBLPROPERTIES ('parquet.compression'='SNAPPY');

-- 区域销售统计表
CREATE EXTERNAL TABLE IF NOT EXISTS dm_region_sales (
    stat_date STRING COMMENT '统计日期',
    stat_type STRING COMMENT '统计类型：day/week/month',
    province STRING COMMENT '省份',
    city STRING COMMENT '城市',
    user_count BIGINT COMMENT '用户数',
    order_count BIGINT COMMENT '订单数',
    sales_amount DECIMAL(14,2) COMMENT '销售金额',
    user_ratio DECIMAL(5,4) COMMENT '用户占比',
    order_ratio DECIMAL(5,4) COMMENT '订单占比',
    amount_ratio DECIMAL(5,4) COMMENT '金额占比',
    avg_user_spend DECIMAL(10,2) COMMENT '人均消费',
    rank_province INT COMMENT '省内排名',
    rank_total INT COMMENT '全国排名',
    dt STRING
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/ecommerce/dm/region_sales'
TBLPROPERTIES ('parquet.compression'='SNAPPY');
