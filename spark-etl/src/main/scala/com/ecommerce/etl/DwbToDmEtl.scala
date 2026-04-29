/**
 * DWB到DM层ETL任务
 * 功能：将宽表数据高度聚合，构建业务主题数据
 * 作用：支撑报表和多维分析，提供业务决策支持
 */
package com.ecommerce.etl

import org.apache.spark.sql.expressions.Window
import org.apache.spark.sql.functions._
import org.apache.spark.sql.SparkSession

object DwbToDmEtl {
  
  def main(args: Array[String]): Unit = {
    val spark = EtlConfig.getSparkSession("DwbToDmEtl")
    val dt = if (args.length > 0) args(0) else java.time.LocalDate.now().toString
    
    try {
      processSalesOverview(spark, dt)
      processProductSales(spark, dt)
      processCategorySales(spark, dt)
      processUserOverview(spark, dt)
      processUserSegment(spark, dt)
      processPaymentStats(spark, dt)
      processRegionSales(spark, dt)
    } finally {
      spark.stop()
    }
  }
  
  def processSalesOverview(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val orderWideDF = spark.table("dwb_ecommerce.dwb_order_wide")
    
    val dayStatsDF = orderWideDF
      .groupBy($"create_date".alias("stat_date"))
      .agg(
        count($"order_id").alias("order_count"),
        countDistinct($"user_id").alias("user_count"),
        sum($"total_amount").alias("total_amount"),
        sum($"pay_amount").alias("pay_amount"),
        avg($"pay_amount").alias("avg_order_amount"),
        (sum($"pay_amount") / countDistinct($"user_id")).alias("avg_user_spend"),
        (count(when($"is_completed" === 1, $"order_id")) / count($"order_id")).alias("order_completion_rate")
      )
      .withColumn("stat_type", lit("day"))
      .withColumn("dt", lit(dt))
    
    dayStatsDF.write
      .mode("append")
      .partitionBy("dt")
      .saveAsTable("dm_ecommerce.dm_sales_overview")
    
    println(s"Successfully processed dm_sales_overview for dt: $dt")
  }
  
  def processProductSales(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val productSalesWideDF = spark.table("dwb_ecommerce.dwb_product_sales_wide")
      .filter($"create_date" === dt)
    
    val productSalesDF = productSalesWideDF
      .groupBy(
        $"create_date".alias("stat_date"),
        $"product_id", $"product_name",
        $"category_level1_id", $"category_level1_name",
        $"category_level2_id", $"category_level2_name",
        $"brand_id", $"brand_name", $"price_range"
      )
      .agg(
        sum($"quantity").alias("sales_quantity"),
        sum($"total_price").alias("sales_amount"),
        countDistinct($"order_id").alias("order_count"),
        countDistinct($"user_id").alias("user_count")
      )
      .withColumn("stat_type", lit("day"))
      .withColumn("rank_total", row_number().over(Window.orderBy($"sales_amount".desc)))
      .withColumn("rank_category", row_number().over(Window.partitionBy($"category_level1_id").orderBy($"sales_amount".desc)))
      .withColumn("dt", lit(dt))
    
    productSalesDF.write
      .mode("append")
      .partitionBy("dt")
      .saveAsTable("dm_ecommerce.dm_product_sales")
    
    println(s"Successfully processed dm_product_sales for dt: $dt")
  }
  
  def processCategorySales(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val productSalesWideDF = spark.table("dwb_ecommerce.dwb_product_sales_wide")
      .filter($"create_date" === dt)
    
    val totalAmount = productSalesWideDF.agg(sum($"total_price")).first().getDecimal(0)
    
    val categorySalesDF = productSalesWideDF
      .groupBy(
        $"create_date".alias("stat_date"),
        $"category_level1_id".alias("category_id"),
        $"category_level1_name".alias("category_name")
      )
      .agg(
        countDistinct($"product_id").alias("product_count"),
        sum($"quantity").alias("sales_quantity"),
        sum($"total_price").alias("sales_amount"),
        countDistinct($"order_id").alias("order_count"),
        countDistinct($"user_id").alias("user_count"),
        (sum($"total_price") / sum($"quantity")).alias("avg_price")
      )
      .withColumn("stat_type", lit("day"))
      .withColumn("category_level", lit(1))
      .withColumn("parent_id", lit(null))
      .withColumn("sales_ratio", $"sales_amount" / lit(totalAmount))
      .withColumn("dt", lit(dt))
    
    categorySalesDF.write
      .mode("append")
      .partitionBy("dt")
      .saveAsTable("dm_ecommerce.dm_category_sales")
    
    println(s"Successfully processed dm_category_sales for dt: $dt")
  }
  
  def processUserOverview(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val userBehaviorWideDF = spark.table("dwb_ecommerce.dwb_user_behavior_wide").filter($"dt" === dt)
    val orderWideDF = spark.table("dwb_ecommerce.dwb_order_wide")
    
    val newUsers = userBehaviorWideDF.filter($"register_date" === dt).count()
    val totalUsers = userBehaviorWideDF.count()
    val activeUsers = userBehaviorWideDF.filter($"is_active" === 1).count()
    val paidUsers = userBehaviorWideDF.filter($"total_orders" > 0).count()
    val newPaidUsers = userBehaviorWideDF.filter($"first_order_date" === dt).count()
    val totalAmount = userBehaviorWideDF.agg(sum($"total_amount")).first().getDecimal(0)
    
    val userOverviewDF = Seq((
      dt, "day",
      totalUsers, newUsers, activeUsers, paidUsers, newPaidUsers,
      paidUsers.toDouble / totalUsers,
      newPaidUsers.toDouble / newUsers,
      totalAmount / totalUsers,
      totalAmount / paidUsers
    )).toDF("stat_date", "stat_type", "total_users", "new_users", "active_users",
      "paid_users", "new_paid_users", "user_conversion_rate", "paid_conversion_rate",
      "arpu", "arppu")
      .withColumn("dt", lit(dt))
    
    userOverviewDF.write
      .mode("append")
      .partitionBy("dt")
      .saveAsTable("dm_ecommerce.dm_user_overview")
    
    println(s"Successfully processed dm_user_overview for dt: $dt")
  }
  
  def processUserSegment(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val userBehaviorWideDF = spark.table("dwb_ecommerce.dwb_user_behavior_wide").filter($"dt" === dt)
    
    val totalUsers = userBehaviorWideDF.count()
    
    val userSegmentDF = userBehaviorWideDF
      .groupBy($"user_level", $"age_group", $"gender", $"province", $"city")
      .agg(
        count($"user_id").alias("user_count"),
        sum($"total_orders").alias("total_orders"),
        sum($"total_amount").alias("total_amount"),
        avg($"avg_order_amount").alias("avg_order_amount"),
        avg($"total_amount").alias("avg_user_spend"),
        avg($"total_orders").alias("order_frequency")
      )
      .withColumn("stat_date", lit(dt))
      .withColumn("user_ratio", $"user_count" / lit(totalUsers))
      .withColumn("dt", lit(dt))
    
    userSegmentDF.write
      .mode("append")
      .partitionBy("dt")
      .saveAsTable("dm_ecommerce.dm_user_segment")
    
    println(s"Successfully processed dm_user_segment for dt: $dt")
  }
  
  def processPaymentStats(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val orderWideDF = spark.table("dwb_ecommerce.dwb_order_wide")
      .filter($"create_date" === dt)
    
    val totalOrders = orderWideDF.count()
    val totalAmount = orderWideDF.agg(sum($"pay_amount")).first().getDecimal(0)
    
    val paymentStatsDF = orderWideDF
      .groupBy($"pay_type")
      .agg(
        count($"order_id").alias("order_count"),
        sum($"pay_amount").alias("pay_amount"),
        countDistinct($"user_id").alias("user_count"),
        avg($"pay_amount").alias("avg_order_amount")
      )
      .withColumn("stat_date", lit(dt))
      .withColumn("stat_type", lit("day"))
      .withColumn("order_ratio", $"order_count" / lit(totalOrders))
      .withColumn("amount_ratio", $"pay_amount" / lit(totalAmount))
      .withColumn("dt", lit(dt))
    
    paymentStatsDF.write
      .mode("append")
      .partitionBy("dt")
      .saveAsTable("dm_ecommerce.dm_payment_stats")
    
    println(s"Successfully processed dm_payment_stats for dt: $dt")
  }
  
  def processRegionSales(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val orderWideDF = spark.table("dwb_ecommerce.dwb_order_wide")
      .filter($"create_date" === dt)
    
    val totalAmount = orderWideDF.agg(sum($"pay_amount")).first().getDecimal(0)
    val totalUsers = orderWideDF.select(countDistinct($"user_id")).first().getLong(0)
    val totalOrders = orderWideDF.count()
    
    val regionSalesDF = orderWideDF
      .groupBy($"province", $"city")
      .agg(
        countDistinct($"user_id").alias("user_count"),
        count($"order_id").alias("order_count"),
        sum($"pay_amount").alias("sales_amount"),
        (sum($"pay_amount") / countDistinct($"user_id")).alias("avg_user_spend")
      )
      .withColumn("stat_date", lit(dt))
      .withColumn("stat_type", lit("day"))
      .withColumn("user_ratio", $"user_count" / lit(totalUsers))
      .withColumn("order_ratio", $"order_count" / lit(totalOrders))
      .withColumn("amount_ratio", $"sales_amount" / lit(totalAmount))
      .withColumn("rank_total", row_number().over(Window.orderBy($"sales_amount".desc)))
      .withColumn("rank_province", row_number().over(Window.partitionBy($"province").orderBy($"sales_amount".desc)))
      .withColumn("dt", lit(dt))
    
    regionSalesDF.write
      .mode("append")
      .partitionBy("dt")
      .saveAsTable("dm_ecommerce.dm_region_sales")
    
    println(s"Successfully processed dm_region_sales for dt: $dt")
  }
}
