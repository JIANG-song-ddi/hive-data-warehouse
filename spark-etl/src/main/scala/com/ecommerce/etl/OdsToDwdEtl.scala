/**
 * ODS到DWD层ETL任务
 * 功能：将原始数据转换为明细数据，包括数据清洗、标准化、脱敏处理
 * 作用：构建DWD层的维度表和事实表
 */
package com.ecommerce.etl

import org.apache.spark.sql.functions._
import org.apache.spark.sql.{DataFrame, SparkSession}
import org.apache.spark.sql.types._

object OdsToDwdEtl {
  
  def main(args: Array[String]): Unit = {
    val spark = EtlConfig.getSparkSession("OdsToDwdEtl")
    val dt = if (args.length > 0) args(0) else java.time.LocalDate.now().toString
    
    try {
      processUserDim(spark, dt)
      processProductDim(spark, dt)
      processOrderFact(spark, dt)
      processOrderItemFact(spark, dt)
      processPaymentFact(spark, dt)
      processDateDim(spark, dt)
    } finally {
      spark.stop()
    }
  }
  
  def processUserDim(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val userDF = spark.table("ods_ecommerce.ods_user")
      .filter($"dt" === dt)
    
    val userDimDF = userDF
      .withColumn("register_time", to_timestamp($"register_time", "yyyy-MM-dd HH:mm:ss"))
      .withColumn("register_date", to_date($"register_time"))
      .withColumn("last_login_time", to_timestamp($"last_login_time", "yyyy-MM-dd HH:mm:ss"))
      .withColumn("age_group", when($"age" < 18, "0-17")
        .when($"age" < 25, "18-24")
        .when($"age" < 35, "25-34")
        .when($"age" < 45, "35-44")
        .when($"age" < 55, "45-54")
        .otherwise("55+"))
      .withColumn("province", split($"address", "省")(0))
      .withColumn("city", split(split($"address", "市")(0), "省")(1))
      .withColumn("is_active", when(datediff(current_date(), $"last_login_time") <= 30, 1).otherwise(0))
      .withColumn("dt", lit(dt))
    
    userDimDF.write
      .mode("overwrite")
      .partitionBy("dt")
      .saveAsTable("dwd_ecommerce.dwd_user_dim")
    
    println(s"Successfully processed dwd_user_dim for dt: $dt")
  }
  
  def processProductDim(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val categoryDF = spark.table("ods_ecommerce.ods_category")
      .filter($"dt" === dt)
      .select($"category_id", $"category_name", $"parent_id", $"level")
    
    val categoryBroadcast = broadcast(categoryDF)
    
    val productDF = spark.table("ods_ecommerce.ods_product")
      .filter($"dt" === dt)
    
    val productDimDF = productDF
      .join(categoryBroadcast.as("cat1"), $"category_id" === $"cat1.category_id", "left")
      .join(categoryBroadcast.as("cat2"), $"cat1.parent_id" === $"cat2.category_id", "left")
      .withColumn("category_level1_id", when($"cat2.category_id".isNotNull, $"cat2.category_id").otherwise($"cat1.category_id"))
      .withColumn("category_level1_name", when($"cat2.category_name".isNotNull, $"cat2.category_name").otherwise($"cat1.category_name"))
      .withColumn("category_level2_id", when($"cat2.category_id".isNotNull, $"cat1.category_id").otherwise(lit(null)))
      .withColumn("category_level2_name", when($"cat2.category_name".isNotNull, $"cat1.category_name").otherwise(lit(null)))
      .withColumn("discount_rate", when($"original_price" > 0, $"price" / $"original_price").otherwise(lit(1.0)))
      .withColumn("price_range", when($"price" < 50, "0-50")
        .when($"price" < 100, "50-100")
        .when($"price" < 200, "100-200")
        .when($"price" < 500, "200-500")
        .when($"price" < 1000, "500-1000")
        .otherwise("1000+"))
      .withColumn("create_time", to_timestamp($"create_time", "yyyy-MM-dd HH:mm:ss"))
      .withColumn("create_date", to_date($"create_time"))
      .withColumn("update_time", to_timestamp($"update_time", "yyyy-MM-dd HH:mm:ss"))
      .withColumn("is_on_sale", when($"status" === "1", 1).otherwise(0))
      .withColumn("dt", lit(dt))
      .select(
        $"product_id", $"product_name", $"category_id", $"category_name",
        $"category_level1_id", $"category_level1_name", $"category_level2_id", $"category_level2_name",
        $"brand_id", $"brand_name", $"price", $"original_price", $"discount_rate", $"price_range",
        $"stock", $"sales_count", $"status", $"is_on_sale", $"create_time", $"create_date", $"update_time", $"dt"
      )
    
    productDimDF.write
      .mode("overwrite")
      .partitionBy("dt")
      .saveAsTable("dwd_ecommerce.dwd_product_dim")
    
    println(s"Successfully processed dwd_product_dim for dt: $dt")
  }
  
  def processOrderFact(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val orderDF = spark.table("ods_ecommerce.ods_order")
      .filter($"dt" === dt)
    
    val orderFactDF = orderDF
      .withColumn("create_time", to_timestamp($"create_time", "yyyy-MM-dd HH:mm:ss"))
      .withColumn("create_date", to_date($"create_time"))
      .withColumn("create_hour", hour($"create_time"))
      .withColumn("pay_time", to_timestamp($"pay_time", "yyyy-MM-dd HH:mm:ss"))
      .withColumn("pay_date", to_date($"pay_time"))
      .withColumn("ship_time", to_timestamp($"ship_time", "yyyy-MM-dd HH:mm:ss"))
      .withColumn("complete_time", to_timestamp($"complete_time", "yyyy-MM-dd HH:mm:ss"))
      .withColumn("is_paid", when($"pay_time".isNotNull, 1).otherwise(0))
      .withColumn("is_shipped", when($"ship_time".isNotNull, 1).otherwise(0))
      .withColumn("is_completed", when($"complete_time".isNotNull, 1).otherwise(0))
      .withColumn("year", year($"create_date"))
      .withColumn("quarter", quarter($"create_date"))
      .withColumn("month", month($"create_date"))
      .withColumn("week", weekofyear($"create_date"))
      .withColumn("day", dayofmonth($"create_date"))
      .withColumn("day_of_week", dayofweek($"create_date"))
      .withColumn("is_weekend", when(dayofweek($"create_date").isin(1,7), 1).otherwise(0))
      .withColumn("dt", lit(dt))
    
    orderFactDF.write
      .mode("overwrite")
      .partitionBy("dt")
      .saveAsTable("dwd_ecommerce.dwd_order_fact")
    
    println(s"Successfully processed dwd_order_fact for dt: $dt")
  }
  
  def processOrderItemFact(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val orderItemDF = spark.table("ods_ecommerce.ods_order_item")
      .filter($"dt" === dt)
    
    val orderItemFactDF = orderItemDF
      .withColumn("create_time", to_timestamp(current_timestamp()))
      .withColumn("create_date", to_date($"create_time"))
      .withColumn("dt", lit(dt))
    
    orderItemFactDF.write
      .mode("overwrite")
      .partitionBy("dt")
      .saveAsTable("dwd_ecommerce.dwd_order_item_fact")
    
    println(s"Successfully processed dwd_order_item_fact for dt: $dt")
  }
  
  def processPaymentFact(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val paymentDF = spark.table("ods_ecommerce.ods_payment")
      .filter($"dt" === dt)
    
    val paymentFactDF = paymentDF
      .withColumn("create_time", to_timestamp($"create_time", "yyyy-MM-dd HH:mm:ss"))
      .withColumn("create_date", to_date($"create_time"))
      .withColumn("complete_time", to_timestamp($"complete_time", "yyyy-MM-dd HH:mm:ss"))
      .withColumn("is_success", when($"pay_status" === "SUCCESS", 1).otherwise(0))
      .withColumn("dt", lit(dt))
    
    paymentFactDF.write
      .mode("overwrite")
      .partitionBy("dt")
      .saveAsTable("dwd_ecommerce.dwd_payment_fact")
    
    println(s"Successfully processed dwd_payment_fact for dt: $dt")
  }
  
  def processDateDim(spark: SparkSession, dt: String): Unit = {
    import spark.implicits._
    
    val startDate = java.time.LocalDate.of(2020, 1, 1)
    val endDate = java.time.LocalDate.of(2030, 12, 31)
    val dates = scala.collection.mutable.ListBuffer[(String, String, Int, Int, Int, Int, Int, Int, String, Int, Int)]()
    
    var currentDate = startDate
    while (!currentDate.isAfter(endDate)) {
      val dateStr = currentDate.toString
      val year = currentDate.getYear
      val month = currentDate.getMonthValue
      val day = currentDate.getDayOfMonth
      val dayOfWeek = currentDate.getDayOfWeek.getValue + 1
      val week = java.time.temporal.WeekFields.of(java.util.Locale.CHINA).weekOfYear().get(java.time.LocalDate.parse(dateStr))
      val quarter = (month - 1) / 3 + 1
      val dayName = currentDate.getDayOfWeek.toString
      val isWeekend = if (dayOfWeek == 1 || dayOfWeek == 7) 1 else 0
      val isHoliday = 0
      
      dates += ((dateStr, dateStr, year, quarter, month, week, day, dayOfWeek, dayName, isWeekend, isHoliday))
      currentDate = currentDate.plusDays(1)
    }
    
    val dateDimDF = dates.toDF("date_id", "full_date", "year", "quarter", "month", "week", "day", "day_of_week", "day_name", "is_weekend", "is_holiday")
      .withColumn("full_date", to_date($"full_date"))
      .withColumn("dt", lit(dt))
    
    dateDimDF.write
      .mode("overwrite")
      .partitionBy("dt")
      .saveAsTable("dwd_ecommerce.dwd_date_dim")
    
    println(s"Successfully processed dwd_date_dim for dt: $dt")
  }
}
