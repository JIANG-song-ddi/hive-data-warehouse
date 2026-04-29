/**
 * API服务层
 * 功能：提供前端与后端的通信接口，包含模拟数据
 * 作用：处理数据请求，支持前端的各种功能模块
 */
import axios from 'axios'

const generateProducts = () => {
  const categories = ['电子产品', '电脑', '配件', '平板', '穿戴设备', '服装', '食品', '家居', '运动', '图书']
  const brands = {
    '电子产品': ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OPPO', 'VIVO', 'OnePlus', 'Realme', 'Nokia', 'Sony'],
    '电脑': ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Huawei', 'Xiaomi', 'ThinkPad'],
    '配件': ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'JBL', 'Bose', 'Sony', 'Beats', 'Sennheiser', 'Audio-Technica'],
    '平板': ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Lenovo', 'Microsoft', 'Amazon', 'Asus', 'Acer', 'LG'],
    '穿戴设备': ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Fitbit', 'Garmin', 'Amazfit', 'TicWatch', 'Suunto', 'Polar'],
    '服装': ['Nike', 'Adidas', 'Under Armour', 'Puma', 'Reebok', 'New Balance', 'Asics', 'Lululemon', 'Columbia', 'Patagonia'],
    '食品': ['Nestle', 'Unilever', 'Pepsi', 'Coca-Cola', 'Danone', 'Mars', 'Kraft Heinz', 'Mondelez', 'General Mills', ' Kellogg'],
    '家居': ['IKEA', 'Nitori', 'MUJI', 'Herman Miller', 'Steelcase', 'Haworth', 'Knoll', 'Stressless', 'Ekornes', 'La-Z-Boy'],
    '运动': ['Nike', 'Adidas', 'Under Armour', 'Puma', 'Reebok', 'New Balance', 'Asics', 'Columbia', 'Patagonia', 'The North Face'],
    '图书': ['Penguin Random House', 'HarperCollins', 'Simon & Schuster', 'Macmillan', 'Hachette', 'Scholastic', 'Pearson', 'McGraw-Hill', 'Wiley', 'Oxford University Press']
  }
  const productNames = {
    '电子产品': ['智能手机', '智能手表', '智能音箱', '智能摄像头', '智能门锁', '智能灯泡', '智能插座', '智能体重秤', '智能血压计', '智能血糖仪'],
    '电脑': ['笔记本电脑', '台式电脑', '一体机', '游戏本', '商务本', '轻薄本', '工作站', '迷你主机', '平板电脑', '二合一电脑'],
    '配件': ['耳机', '音箱', '充电器', '数据线', '移动电源', '保护壳', '贴膜', '键盘', '鼠标', '路由器'],
    '平板': ['平板电脑', '二合一平板', '游戏平板', '商务平板', '教育平板', '绘图平板', '阅读平板', '儿童平板', '专业平板', '轻薄平板'],
    '穿戴设备': ['智能手表', '智能手环', '智能眼镜', '智能耳机', '智能服装', '智能鞋', '智能头盔', '智能手套', '智能腰带', '智能背包'],
    '服装': ['T恤', '衬衫', '卫衣', '外套', '裤子', '裙子', '鞋子', '帽子', '袜子', '内衣'],
    '食品': ['零食', '饮料', '水果', '蔬菜', '肉类', '海鲜', '乳制品', '谷物', '调味品', '保健品'],
    '家居': ['沙发', '床', '桌子', '椅子', '柜子', '灯具', '地毯', '窗帘', '装饰品', '收纳用品'],
    '运动': ['运动鞋', '运动服', '运动背包', '运动手表', '运动耳机', '运动护具', '运动器材', '运动配件', '运动饮料', '运动营养'],
    '图书': ['小说', '散文', '诗歌', '传记', '历史', '哲学', '科学', '技术', '艺术', '教育']
  }
  const statuses = ['上架', '下架']
  
  const products = []
  for (let i = 1; i <= 3000; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const brand = brands[category][Math.floor(Math.random() * brands[category].length)]
    const productName = productNames[category][Math.floor(Math.random() * productNames[category].length)]
    const price = (Math.random() * 10000 + 100).toFixed(2)
    const stock = Math.floor(Math.random() * 1000 + 100)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    products.push({
      product_id: `P${String(i).padStart(6, '0')}`,
      product_name: `${brand} ${productName} ${Math.floor(Math.random() * 100)}`,
      category_level1_name: category,
      brand_name: brand,
      price: parseFloat(price),
      stock: stock,
      status: status
    })
  }
  return products
}

// 检查是否有导入的数据
let products = window.importedData?.products || generateProducts()

const generateUsers = () => {
  const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗', '郑', '梁', '谢', '宋', '唐', '许', '韩', '冯', '邓', '曹', '彭', '曾', '肖', '田', '董', '袁', '潘', '于', '蒋', '蔡', '余', '杜', '叶', '程', '苏', '魏', '吕', '丁', '任', '沈', '姚', '卢', '姜', '崔', '钟', '谭', '陆', '汪', '范', '金', '石', '廖', '贾', '夏', '韦', '付', '方', '白', '邹', '孟', '熊', '秦', '邱', '江', '尹', '薛', '闫', '段', '雷', '侯', '龙', '史', '陶', '黎', '贺', '顾', '毛', '郝', '龚', '邵', '万', '钱', '严', '覃', '武', '戴', '莫', '孔', '向', '汤']
  const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞', '平', '刚', '桂英', '荣', '玉', '梅', '红', '健', '燕', '春', '辉', '军', '芳', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞', '平', '刚', '桂英', '荣', '玉', '梅', '红', '健', '燕', '春', '辉']
  const genders = ['男', '女']
  const userLevels = ['Normal', 'Silver', 'Gold', 'VIP']
  const provinces = ['北京', '上海', '广东', '浙江', '江苏', '山东', '河南', '四川', '湖北', '福建', '河北', '湖南', '安徽', '辽宁', '陕西', '黑龙江', '江西', '吉林', '重庆', '云南', '广西', '山西', '内蒙古', '贵州', '甘肃', '新疆', '海南', '宁夏', '青海', '西藏', '香港', '澳门', '台湾']
  const statuses = ['正常', '禁用']
  
  const users = []
  for (let i = 1; i <= 3000; i++) {
    const surname = surnames[Math.floor(Math.random() * surnames.length)]
    const name = names[Math.floor(Math.random() * names.length)]
    const gender = genders[Math.floor(Math.random() * genders.length)]
    const age = Math.floor(Math.random() * 43) + 18 // 18-60岁
    const userLevel = userLevels[Math.floor(Math.random() * userLevels.length)]
    const province = provinces[Math.floor(Math.random() * provinces.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    users.push({
      user_id: `U${String(i).padStart(6, '0')}`,
      username: `${surname.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
      real_name: `${surname}${name}`,
      phone: `13${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
      email: `${surname.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`,
      gender: gender,
      age: age,
      user_level: userLevel,
      province: province,
      status: status
    })
  }
  return users
}

let users = window.importedData?.users || generateUsers()

const generateOrders = (users, products) => {
  const payTypes = ['支付宝', '微信支付', '银行卡', '信用卡']
  const statuses = ['待支付', '已支付', '已发货', '已完成', '已取消']
  
  const orders = []
  for (let i = 1; i <= 3000; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const product = products[Math.floor(Math.random() * products.length)]
    const quantity = Math.floor(Math.random() * 5) + 1 // 1-5件
    const unitPrice = product.price
    const totalAmount = (quantity * unitPrice).toFixed(2)
    const payType = payTypes[Math.floor(Math.random() * payTypes.length)]
    
    // 生成过去30天内的随机日期
    const today = new Date()
    const daysAgo = Math.floor(Math.random() * 30)
    const orderDate = new Date(today)
    orderDate.setDate(orderDate.getDate() - daysAgo)
    
    // 生成随机时间
    const hours = Math.floor(Math.random() * 24)
    const minutes = Math.floor(Math.random() * 60)
    const seconds = Math.floor(Math.random() * 60)
    orderDate.setHours(hours, minutes, seconds)
    
    const orderDateStr = orderDate.toISOString().replace('T', ' ').substring(0, 19)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    orders.push({
      order_id: `O${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      user_id: user.user_id,
      product_name: product.product_name,
      quantity: quantity,
      unit_price: unitPrice,
      total_amount: parseFloat(totalAmount),
      pay_type: payType,
      order_date: orderDateStr,
      status: status
    })
  }
  return orders
}

let orders = window.importedData?.orders || generateOrders(users, products)

const generateMockData = () => {
  const today = new Date()
  const days = 30
  const salesData = []
  const userData = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    salesData.push({
      stat_date: dateStr,
      order_count: Math.floor(Math.random() * 1000 + 500),
      user_count: Math.floor(Math.random() * 500 + 200),
      total_amount: (Math.random() * 100000 + 50000).toFixed(2),
      pay_amount: (Math.random() * 90000 + 45000).toFixed(2),
      avg_order_amount: (Math.random() * 200 + 100).toFixed(2),
      avg_user_spend: (Math.random() * 300 + 150).toFixed(2),
      order_completion_rate: (Math.random() * 0.3 + 0.7).toFixed(4)
    })
    
    userData.push({
      stat_date: dateStr,
      total_users: 10000 + Math.floor(i * 100),
      new_users: Math.floor(Math.random() * 200 + 50),
      active_users: Math.floor(Math.random() * 3000 + 2000),
      paid_users: Math.floor(Math.random() * 1500 + 500),
      new_paid_users: Math.floor(Math.random() * 50 + 10),
      user_conversion_rate: (Math.random() * 0.3 + 0.1).toFixed(4),
      paid_conversion_rate: (Math.random() * 0.2 + 0.05).toFixed(4),
      arpu: (Math.random() * 100 + 50).toFixed(2),
      arppu: (Math.random() * 200 + 100).toFixed(2)
    })
  }
  
  // 生成产品销售数据
  const productSales = []
  const categories = ['电子产品', '电脑', '配件', '平板', '穿戴设备', '服装', '食品', '家居', '运动', '图书']
  const brands = {
    '电子产品': ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OPPO', 'VIVO', 'OnePlus', 'Realme', 'Nokia', 'Sony'],
    '电脑': ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Huawei', 'Xiaomi', 'ThinkPad'],
    '配件': ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'JBL', 'Bose', 'Sony', 'Beats', 'Sennheiser', 'Audio-Technica'],
    '平板': ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Lenovo', 'Microsoft', 'Amazon', 'Asus', 'Acer', 'LG'],
    '穿戴设备': ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Fitbit', 'Garmin', 'Amazfit', 'TicWatch', 'Suunto', 'Polar'],
    '服装': ['Nike', 'Adidas', 'Under Armour', 'Puma', 'Reebok', 'New Balance', 'Asics', 'Lululemon', 'Columbia', 'Patagonia'],
    '食品': ['Nestle', 'Unilever', 'Pepsi', 'Coca-Cola', 'Danone', 'Mars', 'Kraft Heinz', 'Mondelez', 'General Mills', 'Kellogg'],
    '家居': ['IKEA', 'Nitori', 'MUJI', 'Herman Miller', 'Steelcase', 'Haworth', 'Knoll', 'Stressless', 'Ekornes', 'La-Z-Boy'],
    '运动': ['Nike', 'Adidas', 'Under Armour', 'Puma', 'Reebok', 'New Balance', 'Asics', 'Columbia', 'Patagonia', 'The North Face'],
    '图书': ['Penguin Random House', 'HarperCollins', 'Simon & Schuster', 'Macmillan', 'Hachette', 'Scholastic', 'Pearson', 'McGraw-Hill', 'Wiley', 'Oxford University Press']
  }
  const productNames = {
    '电子产品': ['智能手机', '智能手表', '智能音箱', '智能摄像头', '智能门锁', '智能灯泡', '智能插座', '智能体重秤', '智能血压计', '智能血糖仪'],
    '电脑': ['笔记本电脑', '台式电脑', '一体机', '游戏本', '商务本', '轻薄本', '工作站', '迷你主机', '平板电脑', '二合一电脑'],
    '配件': ['耳机', '音箱', '充电器', '数据线', '移动电源', '保护壳', '贴膜', '键盘', '鼠标', '路由器'],
    '平板': ['平板电脑', '二合一平板', '游戏平板', '商务平板', '教育平板', '绘图平板', '阅读平板', '儿童平板', '专业平板', '轻薄平板'],
    '穿戴设备': ['智能手表', '智能手环', '智能眼镜', '智能耳机', '智能服装', '智能鞋', '智能头盔', '智能手套', '智能腰带', '智能背包'],
    '服装': ['T恤', '衬衫', '卫衣', '外套', '裤子', '裙子', '鞋子', '帽子', '袜子', '内衣'],
    '食品': ['零食', '饮料', '水果', '蔬菜', '肉类', '海鲜', '乳制品', '谷物', '调味品', '保健品'],
    '家居': ['沙发', '床', '桌子', '椅子', '柜子', '灯具', '地毯', '窗帘', '装饰品', '收纳用品'],
    '运动': ['运动鞋', '运动服', '运动背包', '运动手表', '运动耳机', '运动护具', '运动器材', '运动配件', '运动饮料', '运动营养'],
    '图书': ['小说', '散文', '诗歌', '传记', '历史', '哲学', '科学', '技术', '艺术', '教育']
  }
  
  for (let i = 1; i <= 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const brand = brands[category][Math.floor(Math.random() * brands[category].length)]
    const productName = productNames[category][Math.floor(Math.random() * productNames[category].length)]
    const salesQuantity = Math.floor(Math.random() * 1000 + 100)
    const salesAmount = (salesQuantity * (Math.random() * 1000 + 100)).toFixed(2)
    
    productSales.push({
      product_id: `P${String(i).padStart(6, '0')}`,
      product_name: `${brand} ${productName} ${Math.floor(Math.random() * 100)}`,
      category_level1_name: category,
      brand_name: brand,
      sales_quantity: salesQuantity,
      sales_amount: salesAmount,
      rank_total: i
    })
  }
  
  // 按销售金额排序
  productSales.sort((a, b) => parseFloat(b.sales_amount) - parseFloat(a.sales_amount))
  productSales.forEach((item, index) => {
    item.rank_total = index + 1
  })
  
  // 生成类别销售数据
  const categorySales = categories.map((category, index) => {
    const productCount = Math.floor(Math.random() * 200 + 50)
    const salesQuantity = Math.floor(Math.random() * 5000 + 500)
    const salesAmount = (salesQuantity * (Math.random() * 500 + 50)).toFixed(2)
    const avgPrice = (parseFloat(salesAmount) / salesQuantity).toFixed(2)
    const salesRatio = (Math.random() * 0.3 + 0.05).toFixed(2)
    
    return {
      category_id: `C${String(index + 1).padStart(2, '0')}`,
      category_name: category,
      product_count: productCount,
      sales_quantity: salesQuantity,
      sales_amount: salesAmount,
      avg_price: avgPrice,
      sales_ratio: salesRatio
    }
  })
  
  // 生成支付方式统计数据
  const payTypes = ['支付宝', '微信支付', '银行卡', '信用卡']
  const paymentStats = payTypes.map((payType, index) => {
    const orderCount = Math.floor(Math.random() * 1000 + 200)
    const orderRatio = (Math.random() * 0.3 + 0.1).toFixed(2)
    const payAmount = (orderCount * (Math.random() * 500 + 100)).toFixed(2)
    const amountRatio = (Math.random() * 0.3 + 0.1).toFixed(2)
    const userCount = Math.floor(Math.random() * 800 + 100)
    const avgOrderAmount = (parseFloat(payAmount) / orderCount).toFixed(2)
    
    return {
      pay_type: payType,
      order_count: orderCount,
      order_ratio: orderRatio,
      pay_amount: payAmount,
      amount_ratio: amountRatio,
      user_count: userCount,
      avg_order_amount: avgOrderAmount
    }
  })
  
  // 生成地区销售数据
  const provinces = ['北京', '上海', '广东', '浙江', '江苏', '山东', '河南', '四川', '湖北', '福建']
  const regionSales = provinces.map((province, index) => {
    const userCount = Math.floor(Math.random() * 3000 + 2000)
    const orderCount = Math.floor(Math.random() * 2000 + 1000)
    const salesAmount = (orderCount * (Math.random() * 300 + 100)).toFixed(2)
    const userRatio = (Math.random() * 0.1 + 0.05).toFixed(2)
    const orderRatio = (Math.random() * 0.1 + 0.05).toFixed(2)
    const amountRatio = (Math.random() * 0.1 + 0.05).toFixed(2)
    const avgUserSpend = (parseFloat(salesAmount) / userCount).toFixed(2)
    
    return {
      province: province,
      city: `${province}市`,
      user_count: userCount,
      order_count: orderCount,
      sales_amount: salesAmount,
      user_ratio: userRatio,
      order_ratio: orderRatio,
      amount_ratio: amountRatio,
      avg_user_spend: avgUserSpend,
      rank_total: index + 1,
      rank_province: 1
    }
  })
  
  return { salesData, userData, productSales, categorySales, paymentStats, regionSales }
}

const mockData = generateMockData()

// 检查登录状态
const checkLoginStatus = () => {
  return localStorage.getItem('adminLoggedIn') === 'true'
}

const request = axios.create({
  baseURL: 'http://localhost:8085/api/dw',
  timeout: 5000
})

request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API Error:', error)
    console.log('Falling back to mock data')
    return Promise.reject(error)
  }
)

export default {
  getSalesOverview(startDate, endDate) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        // 检查是否有导入的数据
        if (window.importedData && window.importedData.orders && window.importedData.orders.length === 0) {
          // 如果数据已清空，返回空数据
          resolve({ code: 200, data: [] })
        } else {
          resolve({ code: 200, data: mockData.salesData })
        }
      }, 300)
    })
  },
  
  getProductSales(date, limit) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        // 检查是否有导入的数据
        if (window.importedData && window.importedData.products && window.importedData.products.length === 0) {
          // 如果数据已清空，返回空数据
          resolve({ code: 200, data: [] })
        } else {
          resolve({ code: 200, data: mockData.productSales.slice(0, limit) })
        }
      }, 300)
    })
  },
  
  getCategorySales(date) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        // 检查是否有导入的数据
        if (window.importedData && window.importedData.products && window.importedData.products.length === 0) {
          // 如果数据已清空，返回空数据
          resolve({ code: 200, data: [] })
        } else {
          resolve({ code: 200, data: mockData.categorySales })
        }
      }, 300)
    })
  },
  
  getUserOverview(startDate, endDate) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        // 检查是否有导入的数据
        if (window.importedData && window.importedData.users && window.importedData.users.length === 0) {
          // 如果数据已清空，返回空数据
          resolve({ code: 200, data: [] })
        } else {
          resolve({ code: 200, data: mockData.userData })
        }
      }, 300)
    })
  },
  
  getUserSegment(date) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        resolve({ code: 200, data: [] })
      }, 300)
    })
  },
  
  getPaymentStats(date) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        // 检查是否有导入的数据
        if (window.importedData && window.importedData.orders && window.importedData.orders.length === 0) {
          // 如果数据已清空，返回空数据
          resolve({ code: 200, data: [] })
        } else {
          resolve({ code: 200, data: mockData.paymentStats })
        }
      }, 300)
    })
  },
  
  getRegionSales(date) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        // 检查是否有导入的数据
        if (window.importedData && window.importedData.orders && window.importedData.orders.length === 0) {
          // 如果数据已清空，返回空数据
          resolve({ code: 200, data: [] })
        } else {
          resolve({ code: 200, data: mockData.regionSales })
        }
      }, 300)
    })
  },
  
  getTrendData(type, startDate, endDate) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        const data = mockData.salesData.map(item => ({
          stat_date: item.stat_date,
          amount: type === 'sales' ? item.pay_amount : (Math.random() * 200 + 100).toFixed(2),
          count: type === 'sales' ? item.order_count : Math.floor(Math.random() * 200 + 50)
        }))
        resolve({ code: 200, data })
      }, 300)
    })
  },
  
  executeQuery(sql) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        // 简单的SQL查询处理逻辑
        const currentProducts = window.importedData?.products || products
        const currentUsers = window.importedData?.users || users
        const currentOrders = window.importedData?.orders || orders
        
        const upperSql = sql.toUpperCase().trim()
        let result = []
        
        try {
          // 查询商品数据
          if (upperSql.includes('PRODUCT') || upperSql.includes('商品')) {
            // 简单聚合查询 - 商品销售汇总
            if (upperSql.includes('GROUP BY') || upperSql.includes('SUM') || upperSql.includes('COUNT')) {
              const categoryStats = {}
              currentProducts.forEach(p => {
                const category = p.category_level1_name || '未分类'
                if (!categoryStats[category]) {
                  categoryStats[category] = {
                    category_name: category,
                    product_count: 0,
                    total_stock: 0,
                    avg_price: 0
                  }
                }
                categoryStats[category].product_count++
                categoryStats[category].total_stock += p.stock || 0
                categoryStats[category].avg_price += p.price || 0
              })
              
              Object.values(categoryStats).forEach(stat => {
                stat.avg_price = (stat.avg_price / stat.product_count).toFixed(2)
              })
              
              result = Object.values(categoryStats)
            } else {
                // 简单商品查询
                result = currentProducts.slice(0, 100).map(p => ({
                  product_id: p.product_id,
                  product_name: p.product_name,
                  category_level1_name: p.category_level1_name,
                  brand_name: p.brand_name,
                  price: p.price,
                  stock: p.stock,
                  status: p.status
                }))
              }
          }
          // 查询用户数据
          else if (upperSql.includes('USER') || upperSql.includes('用户')) {
            // 简单聚合查询 - 用户统计
            if (upperSql.includes('GROUP BY') || upperSql.includes('COUNT')) {
              const provinceStats = {}
              currentUsers.forEach(u => {
                const province = u.province || '未知'
                if (!provinceStats[province]) {
                  provinceStats[province] = {
                    province: province,
                    user_count: 0
                  }
                }
                provinceStats[province].user_count++
              })
              result = Object.values(provinceStats)
            } else {
              // 简单用户查询
              result = currentUsers.slice(0, 100).map(u => ({
                user_id: u.user_id,
                username: u.username,
                real_name: u.real_name,
                phone: u.phone,
                email: u.email,
                gender: u.gender,
                age: u.age,
                user_level: u.user_level,
                province: u.province,
                status: u.status
              }))
            }
          }
          // 查询订单数据
          else if (upperSql.includes('ORDER') || upperSql.includes('订单')) {
            // 简单聚合查询 - 订单统计
            if (upperSql.includes('GROUP BY') || upperSql.includes('SUM') || upperSql.includes('COUNT')) {
              const payTypeStats = {}
              currentOrders.forEach(o => {
                const payType = o.pay_type || '未知'
                if (!payTypeStats[payType]) {
                  payTypeStats[payType] = {
                    pay_type: payType,
                    order_count: 0,
                    total_amount: 0
                  }
                }
                payTypeStats[payType].order_count++
                payTypeStats[payType].total_amount += o.total_amount || 0
              })
              
              Object.values(payTypeStats).forEach(stat => {
                stat.total_amount = stat.total_amount.toFixed(2)
              })
              
              result = Object.values(payTypeStats)
            } else {
              // 简单订单查询
              result = currentOrders.slice(0, 100).map(o => ({
                order_id: o.order_id,
                user_id: o.user_id,
                product_name: o.product_name,
                quantity: o.quantity,
                unit_price: o.unit_price,
                total_amount: o.total_amount,
                pay_type: o.pay_type,
                order_date: o.order_date,
                status: o.status
              }))
            }
          }
          // 查询销售数据
          else if (upperSql.includes('SALE') || upperSql.includes('销售') || upperSql.includes('DM_')) {
            // 返回销售汇总数据
            const salesData = mockData.salesData.slice(0, 30).map(d => ({
              stat_date: d.stat_date,
              order_count: d.order_count,
              user_count: d.user_count,
              total_amount: d.total_amount,
              pay_amount: d.pay_amount,
              avg_order_amount: d.avg_order_amount
            }))
            result = salesData
          }
          // 默认返回所有商品数据
          else {
            result = currentProducts.slice(0, 50).map(p => ({
              product_id: p.product_id,
              product_name: p.product_name,
              category_level1_name: p.category_level1_name,
              price: p.price,
              stock: p.stock
            }))
          }
          
          resolve({ code: 200, data: result })
        } catch (error) {
          resolve({ code: 200, data: [{ message: '查询执行成功，返回模拟数据', sql: sql.substring(0, 100) }] })
        }
      }, 300)
    })
  },

  getProducts(page = 1, pageSize = 100) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        // 每次调用时检查是否有导入的数据
        const currentProducts = window.importedData?.products || products
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const paginatedProducts = currentProducts.slice(start, end)
        resolve({ 
          code: 200, 
          data: {
            list: paginatedProducts,
            total: currentProducts.length,
            page: page,
            pageSize: pageSize
          }
        })
      }, 300)
    })
  },

  addProduct(product) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        products.push(product)
        resolve({ code: 200, data: null })
      }, 300)
    })
  },

  updateProduct(product) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        const index = products.findIndex(p => p.product_id === product.product_id)
        if (index !== -1) {
          products[index] = product
        }
        resolve({ code: 200, data: null })
      }, 300)
    })
  },

  deleteProduct(productId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        products = products.filter(p => p.product_id !== productId)
        resolve({ code: 200, data: null })
      }, 300)
    })
  },

  getUsers(page = 1, pageSize = 100) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        // 每次调用时检查是否有导入的数据
        const currentUsers = window.importedData?.users || users
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const paginatedUsers = currentUsers.slice(start, end)
        resolve({ 
          code: 200, 
          data: {
            list: paginatedUsers,
            total: currentUsers.length,
            page: page,
            pageSize: pageSize
          }
        })
      }, 300)
    })
  },

  addUser(user) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        users.push(user)
        resolve({ code: 200, data: null })
      }, 300)
    })
  },

  updateUser(user) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        const index = users.findIndex(u => u.user_id === user.user_id)
        if (index !== -1) {
          users[index] = user
        }
        resolve({ code: 200, data: null })
      }, 300)
    })
  },

  deleteUser(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        users = users.filter(u => u.user_id !== userId)
        resolve({ code: 200, data: null })
      }, 300)
    })
  },

  getOrders(page = 1, pageSize = 100) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        // 每次调用时检查是否有导入的数据
        const currentOrders = window.importedData?.orders || orders
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const paginatedOrders = currentOrders.slice(start, end)
        resolve({ 
          code: 200, 
          data: {
            list: paginatedOrders,
            total: currentOrders.length,
            page: page,
            pageSize: pageSize
          }
        })
      }, 300)
    })
  },

  addOrder(order) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        orders.push(order)
        resolve({ code: 200, data: null })
      }, 300)
    })
  },

  updateOrder(order) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        const index = orders.findIndex(o => o.order_id === order.order_id)
        if (index !== -1) {
          orders[index] = order
        }
        resolve({ code: 200, data: null })
      }, 300)
    })
  },

  deleteOrder(orderId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查登录状态
        if (!checkLoginStatus()) {
          reject({ code: 401, message: '未登录或权限不足' })
          return
        }
        
        orders = orders.filter(o => o.order_id !== orderId)
        resolve({ code: 200, data: null })
      }, 300)
    })
  }
}
