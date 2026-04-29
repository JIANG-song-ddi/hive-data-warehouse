/**
 * 数据仓库服务类
 * 功能：提供数据仓库的核心业务逻辑，生成模拟数据
 * 作用：为控制器提供数据支持，模拟真实数据仓库的查询结果
 */
package com.ecommerce.dw.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class DataWarehouseService {

    public List<Map<String, Object>> getSalesOverview(String startDate, String endDate) {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        
        while (!start.isAfter(end)) {
            Map<String, Object> row = new HashMap<>();
            row.put("stat_date", start.toString());
            row.put("order_count", (long) (Math.random() * 1000 + 500));
            row.put("user_count", (long) (Math.random() * 500 + 200));
            row.put("total_amount", new BigDecimal(Math.random() * 100000 + 50000).setScale(2, BigDecimal.ROUND_HALF_UP));
            row.put("pay_amount", new BigDecimal(Math.random() * 90000 + 45000).setScale(2, BigDecimal.ROUND_HALF_UP));
            row.put("avg_order_amount", new BigDecimal(Math.random() * 200 + 100).setScale(2, BigDecimal.ROUND_HALF_UP));
            row.put("avg_user_spend", new BigDecimal(Math.random() * 300 + 150).setScale(2, BigDecimal.ROUND_HALF_UP));
            row.put("order_completion_rate", new BigDecimal(Math.random() * 0.3 + 0.7).setScale(4, BigDecimal.ROUND_HALF_UP));
            result.add(row);
            start = start.plusDays(1);
        }
        return result;
    }

    public List<Map<String, Object>> getProductSales(String date, int limit) {
        List<Map<String, Object>> result = new ArrayList<>();
        String[] products = {"iPhone 15", "MacBook Pro", "AirPods Pro", "iPad Air", "Apple Watch", "Samsung Galaxy", "Sony Headphones", "Dell Laptop", "HP Printer", "Nike Shoes"};
        String[] categories = {"电子产品", "电脑", "配件", "平板", "穿戴设备", "手机", "音频", "笔记本", "办公", "运动"};
        
        for (int i = 0; i < limit && i < products.length; i++) {
            Map<String, Object> row = new HashMap<>();
            row.put("product_id", "P" + String.format("%04d", i + 1));
            row.put("product_name", products[i]);
            row.put("category_level1_name", categories[i]);
            row.put("brand_name", "Brand" + (i + 1));
            row.put("sales_quantity", (long) (Math.random() * 500 + 100));
            row.put("sales_amount", new BigDecimal(Math.random() * 50000 + 10000).setScale(2, BigDecimal.ROUND_HALF_UP));
            row.put("rank_total", i + 1);
            result.add(row);
        }
        return result;
    }

    public List<Map<String, Object>> getCategorySales(String date) {
        List<Map<String, Object>> result = new ArrayList<>();
        String[] categories = {"电子产品", "服装", "食品", "家居", "运动", "图书"};
        
        for (int i = 0; i < categories.length; i++) {
            Map<String, Object> row = new HashMap<>();
            row.put("category_id", "C" + String.format("%02d", i + 1));
            row.put("category_name", categories[i]);
            row.put("product_count", (long) (Math.random() * 200 + 50));
            row.put("sales_quantity", (long) (Math.random() * 1000 + 200));
            row.put("sales_amount", new BigDecimal(Math.random() * 100000 + 20000).setScale(2, BigDecimal.ROUND_HALF_UP));
            row.put("avg_price", new BigDecimal(Math.random() * 200 + 50).setScale(2, BigDecimal.ROUND_HALF_UP));
            row.put("sales_ratio", new BigDecimal(Math.random()).setScale(4, BigDecimal.ROUND_HALF_UP));
            result.add(row);
        }
        return result;
    }

    public List<Map<String, Object>> getUserOverview(String startDate, String endDate) {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        long totalUsers = 10000;
        
        while (!start.isAfter(end)) {
            Map<String, Object> row = new HashMap<>();
            row.put("stat_date", start.toString());
            row.put("total_users", totalUsers);
            row.put("new_users", (long) (Math.random() * 200 + 50));
            row.put("active_users", (long) (Math.random() * 3000 + 2000));
            row.put("paid_users", (long) (Math.random() * 1500 + 500));
            row.put("new_paid_users", (long) (Math.random() * 50 + 10));
            row.put("user_conversion_rate", new BigDecimal(Math.random() * 0.3 + 0.1).setScale(4, BigDecimal.ROUND_HALF_UP));
            row.put("paid_conversion_rate", new BigDecimal(Math.random() * 0.2 + 0.05).setScale(4, BigDecimal.ROUND_HALF_UP));
            row.put("arpu", new BigDecimal(Math.random() * 100 + 50).setScale(2, BigDecimal.ROUND_HALF_UP));
            row.put("arppu", new BigDecimal(Math.random() * 200 + 100).setScale(2, BigDecimal.ROUND_HALF_UP));
            totalUsers += (long) row.get("new_users");
            result.add(row);
            start = start.plusDays(1);
        }
        return result;
    }

    public List<Map<String, Object>> getUserSegment(String date) {
        List<Map<String, Object>> result = new ArrayList<>();
        String[] levels = {"Normal", "Silver", "Gold", "VIP"};
        String[] ageGroups = {"18-24", "25-34", "35-44", "45-54", "55+"};
        String[] genders = {"男", "女"};
        String[] provinces = {"北京", "上海", "广东", "浙江", "江苏"};
        
        for (String level : levels) {
            for (String ageGroup : ageGroups) {
                for (String gender : genders) {
                    for (String province : provinces) {
                        if (Math.random() > 0.3) continue;
                        Map<String, Object> row = new HashMap<>();
                        row.put("user_level", level);
                        row.put("age_group", ageGroup);
                        row.put("gender", gender);
                        row.put("province", province);
                        row.put("city", province + "市");
                        row.put("user_count", (long) (Math.random() * 1000 + 100));
                        row.put("user_ratio", new BigDecimal(Math.random()).setScale(4, BigDecimal.ROUND_HALF_UP));
                        row.put("total_orders", (long) (Math.random() * 5000 + 500));
                        row.put("total_amount", new BigDecimal(Math.random() * 100000 + 10000).setScale(2, BigDecimal.ROUND_HALF_UP));
                        row.put("avg_user_spend", new BigDecimal(Math.random() * 500 + 100).setScale(2, BigDecimal.ROUND_HALF_UP));
                        result.add(row);
                    }
                }
            }
        }
        return result;
    }

    public List<Map<String, Object>> getPaymentStats(String date) {
        List<Map<String, Object>> result = new ArrayList<>();
        String[] payTypes = {"支付宝", "微信支付", "银行卡", "信用卡"};
        
        for (String payType : payTypes) {
            Map<String, Object> row = new HashMap<>();
            row.put("pay_type", payType);
            row.put("order_count", (long) (Math.random() * 1000 + 200));
            row.put("order_ratio", new BigDecimal(Math.random()).setScale(4, BigDecimal.ROUND_HALF_UP));
            row.put("pay_amount", new BigDecimal(Math.random() * 80000 + 20000).setScale(2, BigDecimal.ROUND_HALF_UP));
            row.put("amount_ratio", new BigDecimal(Math.random()).setScale(4, BigDecimal.ROUND_HALF_UP));
            row.put("user_count", (long) (Math.random() * 500 + 100));
            row.put("avg_order_amount", new BigDecimal(Math.random() * 200 + 50).setScale(2, BigDecimal.ROUND_HALF_UP));
            result.add(row);
        }
        return result;
    }

    public List<Map<String, Object>> getRegionSales(String date) {
        List<Map<String, Object>> result = new ArrayList<>();
        String[] provinces = {"北京", "上海", "广东", "浙江", "江苏", "山东", "河南", "四川", "湖北", "湖南"};
        
        for (int i = 0; i < provinces.length; i++) {
            Map<String, Object> row = new HashMap<>();
            row.put("province", provinces[i]);
            row.put("city", provinces[i] + "市");
            row.put("user_count", (long) (Math.random() * 5000 + 1000));
            row.put("order_count", (long) (Math.random() * 3000 + 500));
            row.put("sales_amount", new BigDecimal(Math.random() * 200000 + 50000).setScale(2, BigDecimal.ROUND_HALF_UP));
            row.put("user_ratio", new BigDecimal(Math.random()).setScale(4, BigDecimal.ROUND_HALF_UP));
            row.put("order_ratio", new BigDecimal(Math.random()).setScale(4, BigDecimal.ROUND_HALF_UP));
            row.put("amount_ratio", new BigDecimal(Math.random()).setScale(4, BigDecimal.ROUND_HALF_UP));
            row.put("avg_user_spend", new BigDecimal(Math.random() * 300 + 100).setScale(2, BigDecimal.ROUND_HALF_UP));
            row.put("rank_total", i + 1);
            row.put("rank_province", 1);
            result.add(row);
        }
        return result;
    }

    public List<Map<String, Object>> getTrendData(String type, String startDate, String endDate) {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        
        while (!start.isAfter(end)) {
            Map<String, Object> row = new HashMap<>();
            row.put("stat_date", start.toString());
            if ("sales".equals(type)) {
                row.put("amount", new BigDecimal(Math.random() * 100000 + 50000).setScale(2, BigDecimal.ROUND_HALF_UP));
                row.put("count", (long) (Math.random() * 1000 + 500));
            } else {
                row.put("amount", new BigDecimal(Math.random() * 200 + 100).setScale(2, BigDecimal.ROUND_HALF_UP));
                row.put("count", (long) (Math.random() * 200 + 50));
            }
            result.add(row);
            start = start.plusDays(1);
        }
        return result;
    }

    public List<Map<String, Object>> executeQuery(String sql) {
        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> row = new HashMap<>();
        row.put("message", "This is a demo version. Hive integration is disabled.");
        row.put("sql", sql);
        result.add(row);
        return result;
    }
}
