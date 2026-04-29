/**
 * Excel工具类
 * 功能：提供Excel文件的生成、导出和导入功能
 * 作用：处理电商数据的Excel格式转换和数据操作
 */
import * as XLSX from 'xlsx'

// 生成随机产品数据
export const generateProducts = (count = 3000) => {
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
  const statuses = ['上架', '下架']
  
  const products = []
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const brand = brands[category][Math.floor(Math.random() * brands[category].length)]
    const productName = productNames[category][Math.floor(Math.random() * productNames[category].length)]
    const price = (Math.random() * 10000 + 100).toFixed(2)
    const stock = Math.floor(Math.random() * 1000 + 100)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    products.push({
      '商品ID': `P${String(i).padStart(6, '0')}`,
      '商品名称': `${brand} ${productName} ${Math.floor(Math.random() * 100)}`,
      '分类': category,
      '品牌': brand,
      '价格': parseFloat(price),
      '库存': stock,
      '状态': status
    })
  }
  return products
}

// 生成随机用户数据
export const generateUsers = (count = 3000) => {
  const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗', '郑', '梁', '谢', '宋', '唐', '许', '韩', '冯', '邓', '曹', '彭', '曾', '肖', '田', '董', '袁', '潘', '于', '蒋', '蔡', '余', '杜', '叶', '程', '苏', '魏', '吕', '丁', '任', '沈', '姚', '卢', '姜', '崔', '钟', '谭', '陆', '汪', '范', '金', '石', '廖', '贾', '夏', '韦', '付', '方', '白', '邹', '孟', '熊', '秦', '邱', '江', '尹', '薛', '闫', '段', '雷', '侯', '龙', '史', '陶', '黎', '贺', '顾', '毛', '郝', '龚', '邵', '万', '钱', '严', '覃', '武', '戴', '莫', '孔', '向', '汤']
  const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞', '平', '刚', '桂英', '荣', '玉', '梅', '红', '健', '燕', '春', '辉', '军', '芳', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞', '平', '刚', '桂英', '荣', '玉', '梅', '红', '健', '燕', '春', '辉']
  const genders = ['男', '女']
  const userLevels = ['Normal', 'Silver', 'Gold', 'VIP']
  const provinces = ['北京', '上海', '广东', '浙江', '江苏', '山东', '河南', '四川', '湖北', '福建', '河北', '湖南', '安徽', '辽宁', '陕西', '黑龙江', '江西', '吉林', '重庆', '云南', '广西', '山西', '内蒙古', '贵州', '甘肃', '新疆', '海南', '宁夏', '青海', '西藏', '香港', '澳门', '台湾']
  const statuses = ['正常', '禁用']
  
  const users = []
  for (let i = 1; i <= count; i++) {
    const surname = surnames[Math.floor(Math.random() * surnames.length)]
    const name = names[Math.floor(Math.random() * names.length)]
    const gender = genders[Math.floor(Math.random() * genders.length)]
    const age = Math.floor(Math.random() * 43) + 18 // 18-60岁
    const userLevel = userLevels[Math.floor(Math.random() * userLevels.length)]
    const province = provinces[Math.floor(Math.random() * provinces.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    users.push({
      '用户ID': `U${String(i).padStart(6, '0')}`,
      '用户名': `${surname.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
      '真实姓名': `${surname}${name}`,
      '手机号': `13${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
      '邮箱': `${surname.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`,
      '性别': gender,
      '年龄': age,
      '用户等级': userLevel,
      '省份': province,
      '状态': status
    })
  }
  return users
}

// 生成随机订单数据
export const generateOrders = (users, products, count = 3000) => {
  const payTypes = ['支付宝', '微信支付', '银行卡', '信用卡']
  const statuses = ['待支付', '已支付', '已发货', '已完成', '已取消']
  
  const orders = []
  for (let i = 1; i <= count; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const product = products[Math.floor(Math.random() * products.length)]
    const quantity = Math.floor(Math.random() * 5) + 1 // 1-5件
    const unitPrice = product['价格']
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
      '订单ID': `O${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      '用户ID': user['用户ID'],
      '商品名称': product['商品名称'],
      '数量': quantity,
      '单价': unitPrice,
      '总金额': parseFloat(totalAmount),
      '支付方式': payType,
      '下单时间': orderDateStr,
      '状态': status
    })
  }
  return orders
}

// 导出数据到Excel
export const exportToExcel = () => {
  // 生成数据
  const products = generateProducts()
  const users = generateUsers()
  const orders = generateOrders(users, products)
  
  // 创建工作簿
  const wb = XLSX.utils.book_new()
  
  // 添加工作表
  const productWs = XLSX.utils.json_to_sheet(products)
  XLSX.utils.book_append_sheet(wb, productWs, '商品数据')
  
  const userWs = XLSX.utils.json_to_sheet(users)
  XLSX.utils.book_append_sheet(wb, userWs, '用户数据')
  
  const orderWs = XLSX.utils.json_to_sheet(orders)
  XLSX.utils.book_append_sheet(wb, orderWs, '订单数据')
  
  // 导出文件
  XLSX.writeFile(wb, `电商数据集_${new Date().toISOString().split('T')[0]}.xlsx`)
}

// 解析Excel文件
export const parseExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const wb = XLSX.read(data, { type: 'array' })
        
        const result = {}
        wb.SheetNames.forEach(sheetName => {
          const ws = wb.Sheets[sheetName]
          result[sheetName] = XLSX.utils.sheet_to_json(ws)
        })
        
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsArrayBuffer(file)
  })
}

// 转换导入的数据格式
export const transformImportedData = (importedData) => {
  const transformed = {
    products: [],
    users: [],
    orders: []
  }
  
  // 处理商品数据
  if (importedData['商品数据']) {
    transformed.products = importedData['商品数据'].map(item => ({
      product_id: item['商品ID'],
      product_name: item['商品名称'],
      category_level1_name: item['分类'],
      brand_name: item['品牌'],
      price: item['价格'],
      stock: item['库存'],
      status: item['状态']
    }))
  }
  
  // 处理用户数据
  if (importedData['用户数据']) {
    transformed.users = importedData['用户数据'].map(item => ({
      user_id: item['用户ID'],
      username: item['用户名'],
      real_name: item['真实姓名'],
      phone: item['手机号'],
      email: item['邮箱'],
      gender: item['性别'],
      age: item['年龄'],
      user_level: item['用户等级'],
      province: item['省份'],
      status: item['状态']
    }))
  }
  
  // 处理订单数据
  if (importedData['订单数据']) {
    transformed.orders = importedData['订单数据'].map(item => ({
      order_id: item['订单ID'],
      user_id: item['用户ID'],
      product_name: item['商品名称'],
      quantity: item['数量'],
      unit_price: item['单价'],
      total_amount: item['总金额'],
      pay_type: item['支付方式'],
      order_date: item['下单时间'],
      status: item['状态']
    }))
  }
  
  return transformed
}
