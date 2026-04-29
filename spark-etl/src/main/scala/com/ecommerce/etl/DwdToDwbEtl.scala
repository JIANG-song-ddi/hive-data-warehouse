/**
 * DWD到DWB层ETL任务
 * 功能：将明细数据转换为宽表，进行轻度聚合和维度关联
 * 作用：构建星型模型，为DM层提供基础数据
 */
package com.ecommerce.etl

import org.apache.spark.sql.functions._
import org.apache.spark.sql.SparkSession

object DwdToDwbEtl {
  
  def main(args: Array[String]): Unit = {
    val spark = EtlConfig.getSparkSession("DwdToDwbEtl")
    val dt = if (args.length > 0) args(0) else java.time.LocalDate.now().toString
    
    try {
      processOrderWide(spark, dt)
      processProductSalesWide(spark, dt)
      processUserBehaviorWide(spark, dt)
    } finally {
      spark.stop()
    }
  }
  
  def processOrderWide(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val orderFactDF = spark.table("dwd_ecommerce.dwd_order_fact").filter($"dt" === dt)
    val userDimDF = spark.table("dwd_ecommerce.dwd_user_dim").filter($"dt" === dt)
    
    val userBroadcast = broadcast(userDimDF)
    
    val orderWideDF = orderFactDF
      .join(userBroadcast, Seq("user_id"), "left")
      .select(
        $"order_id", $"order_no", $"user_id", $"user_name", $"gender", $"age", $"age_group",
        $"province", $"city", $"total_amount", $"pay_amount", $"freight", $"discount_amount",
        $"pay_type", $"order_status", $"create_time", $"create_date", $"create_hour",
        $"pay_time", $"pay_date", $"is_paid", $"is_completed",
        $"year", $"quarter", $"month", $"week", $"day", $"day_of_week", $"is_weekend",
        $"orderFact.dt"
      )
    
    orderWideDF.write
      .mode("overwrite")
      .partitionBy("dt")
      .saveAsTable("dwb_ecommerce.dwb_order_wide")
    
    println(s"Successfully processed dwb_order_wide for dt: $dt")
  }
  
  def processProductSalesWide(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val orderItemFactDF = spark.table("dwd_ecommerce.dwd_order_item_fact").filter($"dt" === dt)
    val productDimDF = spark.table("dwd_ecommerce.dwd_product_dim").filter($"dt" === dt)
    val orderFactDF = spark.table("dwd_ecommerce.dwd_order_fact").filter($"dt" === dt)
    val userDimDF = spark.table("dwd_ecommerce.dwd_user_dim").filter($"dt" === dt)
    
    val productBroadcast = broadcast(productDimDF)
    val userBroadcast = broadcast(userDimDF)
    
    val productSalesWideDF = orderItemFactDF
      .join(productBroadcast, Seq("product_id"), "left")
      .join(orderFactDF.select($"order_id", $"user_id", $"create_date", $"create_hour", $"year", $"quarter", $"month", $"week", $"day_of_week", $"is_weekend"), Seq("order_id"), "left")
      .join(userBroadcast, Seq("user_id"), "left")
      .select(
        $"item_id", $"order_id", $"product_id", $"product_name",
        $"category_id", $"category_name", $"category_level1_id", $"category_level1_name",
        $"category_level2_id", $"category_level2_name", $"brand_id", $"brand_name",
        $"price", $"original_price", $"discount_rate", $"price_range",
        $"quantity", $"total_price", $"user_id", $"age_group",
        $"province", $"city", $"create_date", $"create_hour",
        $"year", $"quarter", $"month", $"week", $"day_of_week", $"is_weekend",
        $"orderItemFact.dt"
      )
    
    productSalesWideDF.write
      .mode("overwrite")
      .partitionBy("dt")
      .saveAsTable("dwb_ecommerce.dwb_product_sales_wide")
    
    println(s"Successfully processed dwb_product_sales_wide for dt: $dt")
  }
  
  def processUserBehaviorWide(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val userDimDF = spark.table("dwd_ecommerce.dwd_user_dim").filter($"dt" === dt)
    val orderFactDF = spark.table("dwd_ecommerce.dwd_order_fact")
    
    val userOrderStatsDF = orderFactDF
      .groupBy($"user_id")
      .agg(
        count($"order_id").alias("total_orders"),
        sum($"pay_amount").alias("total_amount"),
        avg($"pay_amount").alias("avg_order_amount"),
        min($"create_date").alias("first_order_date"),
        max($"create_date").alias("last_order_date"),
        count(when($"create_date" >= date_sub(lit(dt), 30), $"order_id")).alias("order_count_30d"),
        sum(when($"create_date" >= date_sub(lit(dt), 30), $"pay_amount")).alias("amount_30d")
      )
    
    val userBroadcast = broadcast(userDimDF)
    
    val userBehaviorWideDF = userBroadcast
      .join(userOrderStatsDF, Seq("user_id"), "left")
      .withColumn("user_level", when($"total_amount" >= 10000, "VIP")
        .when($"total_amount" >= 5000, "Gold")
        .when($"total_amount" >= 1000, "Silver")
        .otherwise("Normal"))
      .select(
        $"user_id", $"user_name", $"gender", $"age", $"age_group",
        $"province", $"city", $"register_date", $"last_login_time",
        $"status", $"is_active",
        coalesce($"total_orders", lit(0)).alias("total_orders"),
        coalesce($"total_amount", lit(0)).alias("total_amount"),
        coalesce($"avg_order_amount", lit(0)).alias("avg_order_amount"),
        $"first_order_date", $"last_order_date",
        coalesce($"order_count_30d", lit(0)).alias("order_count_30d"),
        coalesce($"amount_30d", lit(0)).alias("amount_30d"),
        $"user_level", $"dt"
      )
    
    userBehaviorWideDF.write
      .mode("overwrite")
      .partitionBy("dt")
      .saveAsTable("dwb_ecommerce.dwb_user_behavior_wide")
    
    println(s"Successfully processed dwb_user_behavior_wide for dt: $dt")
  }
}
