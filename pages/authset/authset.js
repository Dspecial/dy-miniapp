const app = getApp();
import http from '../../util/api' // 引入api接口管理文件
Page({
  data: {
  },
  onLoad: function (option) {
    console.log(option,'aaaa');
  },

  // 重新授权
  reAuth(){
    var _this = this;
    tt.openSetting({
      success: function (open_res) {
        if(open_res) {
          if (open_res.authSetting["scope.userInfo"] == true) {
            tt.getUserInfo({
              withCredentials: true,
              success: function (info_res) {
                app.login();
                tt.reLaunch({
                  url: '../index/index',
                  success(res) {
                    console.log(`跳转成功`);
                  },
                  fail(res) {
                    console.log(`navigateTo调用失败`);
                  },
                });
              },
              fail: function () {
                console.info("授权失败返回数据");
              }
            });
          }
        }
      },
      fail: function () {
        console.info("设置失败返回数据");
      }
    });
  },
})