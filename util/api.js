// 在这里面定义所有接口，一个文件管理所有接口，易于维护
import { http } from './http'; // 引入刚刚封装好的http模块，import属于ES6的语法，微信开发者工具必须打开ES6转ES5选项

// 每一个接口定义一个函数，然后暴露出去，供逻辑代码调用
function indexCateApi(params) { // 请求测试分类接口
  http('/api/bytdance/items/classify', 'POST', params)  // 接口请求的路由地址以及请求方法在此处传递
}

export default { // 暴露接口
  indexCateApi,
}