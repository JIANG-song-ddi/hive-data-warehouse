/**
 * ETL配置类
 * 功能：提供Spark会话配置，包含AQE优化、广播变量优化等
 * 作用：为所有ETL任务提供统一的Spark配置
 */
package com.ecommerce.etl

import org.apache.spark.sql.SparkSession

object EtlConfig {
  
  def getSparkSession(appName: String): SparkSession = {
    SparkSession.builder()
      .appName(appName)
      .config("spark.sql.adaptive.enabled", "true")
      .config("spark.sql.adaptive.coalescePartitions.enabled", "true")
      .config("spark.sql.adaptive.skewJoin.enabled", "true")
      .config("spark.sql.adaptive.localShuffleReader.enabled", "true")
      .config("spark.sql.autoBroadcastJoinThreshold", "10485760")
      .config("spark.sql.shuffle.partitions", "200")
      .config("spark.sql.parquet.compression.codec", "snappy")
      .config("hive.exec.dynamic.partition", "true")
      .config("hive.exec.dynamic.partition.mode", "nonstrict")
      .enableHiveSupport()
      .getOrCreate()
  }
}
