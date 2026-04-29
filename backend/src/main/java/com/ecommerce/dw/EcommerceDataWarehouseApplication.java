/**
 * Spring Boot应用主类
 * 功能：启动电商数据仓库后端服务
 * 作用：初始化Spring容器，加载所有配置和组件
 */
package com.ecommerce.dw;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EcommerceDataWarehouseApplication {
    public static void main(String[] args) {
        SpringApplication.run(EcommerceDataWarehouseApplication.class, args);
    }
}
