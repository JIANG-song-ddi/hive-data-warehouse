/**
 * 数据仓库REST API控制器
 * 功能：处理前端数据请求，提供数据仓库的各种API接口
 * 作用：暴露数据仓库服务，支持前端可视化和数据查询
 */
package com.ecommerce.dw.controller;

import com.ecommerce.dw.service.DataWarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dw")
public class DataWarehouseController {

    @Autowired
    private DataWarehouseService dataWarehouseService;

    @GetMapping("/sales/overview")
    public Map<String, Object> getSalesOverview(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        List<Map<String, Object>> data = dataWarehouseService.getSalesOverview(
                startDate.toString(), endDate.toString());

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "success");
        result.put("data", data);
        return result;
    }

    @GetMapping("/product/sales")
    public Map<String, Object> getProductSales(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date,
            @RequestParam(defaultValue = "10") int limit) {
        
        if (date == null) {
            date = LocalDate.now().minusDays(1);
        }

        List<Map<String, Object>> data = dataWarehouseService.getProductSales(date.toString(), limit);

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "success");
        result.put("data", data);
        return result;
    }

    @GetMapping("/category/sales")
    public Map<String, Object> getCategorySales(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        
        if (date == null) {
            date = LocalDate.now().minusDays(1);
        }

        List<Map<String, Object>> data = dataWarehouseService.getCategorySales(date.toString());

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "success");
        result.put("data", data);
        return result;
    }

    @GetMapping("/user/overview")
    public Map<String, Object> getUserOverview(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        List<Map<String, Object>> data = dataWarehouseService.getUserOverview(
                startDate.toString(), endDate.toString());

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "success");
        result.put("data", data);
        return result;
    }

    @GetMapping("/user/segment")
    public Map<String, Object> getUserSegment(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        
        if (date == null) {
            date = LocalDate.now().minusDays(1);
        }

        List<Map<String, Object>> data = dataWarehouseService.getUserSegment(date.toString());

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "success");
        result.put("data", data);
        return result;
    }

    @GetMapping("/payment/stats")
    public Map<String, Object> getPaymentStats(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        
        if (date == null) {
            date = LocalDate.now().minusDays(1);
        }

        List<Map<String, Object>> data = dataWarehouseService.getPaymentStats(date.toString());

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "success");
        result.put("data", data);
        return result;
    }

    @GetMapping("/region/sales")
    public Map<String, Object> getRegionSales(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        
        if (date == null) {
            date = LocalDate.now().minusDays(1);
        }

        List<Map<String, Object>> data = dataWarehouseService.getRegionSales(date.toString());

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "success");
        result.put("data", data);
        return result;
    }

    @GetMapping("/trend")
    public Map<String, Object> getTrendData(
            @RequestParam(defaultValue = "sales") String type,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        List<Map<String, Object>> data = dataWarehouseService.getTrendData(
                type, startDate.toString(), endDate.toString());

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "success");
        result.put("data", data);
        return result;
    }

    @PostMapping("/query")
    public Map<String, Object> executeQuery(@RequestBody Map<String, String> request) {
        String sql = request.get("sql");
        
        try {
            List<Map<String, Object>> data = dataWarehouseService.executeQuery(sql);
            
            Map<String, Object> result = new HashMap<>();
            result.put("code", 200);
            result.put("message", "success");
            result.put("data", data);
            return result;
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", 500);
            result.put("message", e.getMessage());
            return result;
        }
    }
}
