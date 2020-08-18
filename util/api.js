// 在这里面定义所有接口，一个文件管理所有接口，易于维护
import { http } from './http'; // 引入刚刚封装好的http模块，import属于ES6的语法，微信开发者工具必须打开ES6转ES5选项

// 每一个接口定义一个函数，然后暴露出去，供逻辑代码调用

/**
 * 首页
 */
function indexBannerApi(params) { // 请求首页banner接口
  http('/api/bytdance/items/item_get_index_item', 'POST', params)  // 接口请求的路由地址以及请求方法在此处传递
}
function indexCateApi(params) { // 请求首页测试分类接口
  http('/api/bytdance/items/item_extend', 'POST', params) 
}
function indexTodayApi(params) { // 请求首页今日精选接口
  http('/api/bytdance/items/item_get_index_item_show', 'POST', params) 
}
function indexRecommendApi(params) { // 请求首页推荐测评接口
  http('/api/bytdance/items/recommend_list', 'POST', params) 
}
function authorizedApi(params) { // 请求授权登录
  http('/api/bytdance/auth/dylogin', 'POST', params) 
}
function authInfoApi(params) { // 请求授权登录-拿到用户信息
  http('/api/bytdance/auth/dyinfo', 'POST', params) 
}
/**
 * 分类
 */
function categoryApi(params) { // 请求测试分类接口
  http('/api/bytdance/items/classify', 'POST', params)
}
function categoryListApi(params) { // 请求测试列表接口
  http('/api/bytdance/items/lists', 'POST', params)
}
function testApi(params) { // 请求测试详情
  http('/api/bytdance/items/details', 'POST', params)
}
function questionApi(params) { // 开始测试详情
  http('/api/bytdance/items/items_test_select', 'POST', params)
}
function questionCommitApi(params) { // 提交答案
  http('/api/bytdance/items/commit_answer', 'POST', params)
}
/**
 * 记录
 */
function porfileApi(params) { // 个人中心
  http('/api/bytdance/items/person', 'POST', params)
}
function mobileApi(params) { // 电话号码
  http('/api/bytdance/items/get_contact_mobile', 'POST', params)
}
function recordListApi(params) { // 测评记录
  http('/api/bytdance/items/record_list', 'POST', params)
}
function reportApi(params) { // 测评详情
  http('/api/bytdance/items/record_details', 'POST', params)
}
function delreportApi(params) { // 删除报告
  http('/api/bytdance/items/record_delete', 'POST', params)
}
function cooperationApi(params) { // 搜索测评
  http('/api/bytdance/items/apply_cooperation', 'POST', params)
}
/**
 * 广告记录
 */
function advApi(params) { // 广告记录
  http('/api/bytdance/commission/expenses', 'POST', params)
}
/**
 * 搜索
 */
function searchApi(params) { // 搜索测评
  http('/api/bytdance/items/search', 'POST', params)
}

export default { // 暴露接口
  indexBannerApi,
  indexCateApi,
  indexTodayApi,
  indexRecommendApi,
  authorizedApi,

  categoryApi,
  categoryListApi,
  testApi,
  questionApi,
  questionCommitApi,
  
  porfileApi,
  mobileApi,
  recordListApi,
  reportApi,
  delreportApi,
  cooperationApi,

  advApi,
  searchApi,
}