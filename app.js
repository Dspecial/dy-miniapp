import http from 'util/api' // 引入api接口管理文件
App({
  globalData:{
  },
  data:{
  },
  onLaunch: function () {
    // 获取用户信息
    tt.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          tt.getUserInfo({
            success: res => {
              // console.log(res);
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
 
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          // 未授权，跳转到授权页面
          tt.reLaunch({
            url: '/pages/authset/authset',
          })
        }
      }
    })
  },
  // 判断是否为空
  isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj == ""){
      return true;
    }else{
      return false;
    }
  },
})
