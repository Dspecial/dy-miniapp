import http from '../../util/api' // 引入api接口管理文件
Page({
  data: {
    loginStatus:true,
  },
  onLoad: function () {
    console.log("用户授权");
    this.login();
  },
  login(){
    var that = this
    tt.login({
      success(res2) {
        tt.request({
          url: 'http://dy.weilaixxjs.cn/api/bytdance/auth/dylogin', // 目标服务器url
          data:{
            code:res2.code,
            xiaochengxu_id:1
          },
          success: (res) => {
            tt.setStorageSync("openid", res.data.data.openid); // 存到本地openid
            that.getinfo(res.data.data.session_key);
          }
        });
      },
      fail(res) {
        console.log(`login调用失败`);
      }
    });
  },
  getinfo(sessionkey){
    var _this = this;
    tt.getUserInfo({
      success(res) {
        //console.log('getinfo调用成功',res);
        tt.request({
          url: 'http://dy.weilaixxjs.cn/api/bytdance/auth/dyinfo', // 目标服务器url
          data:{
            encryptedData:res.encryptedData,
            iv:res.iv,
            sessionKey:sessionkey,
            xiaochengxu_id:1
          },
          success: (res) => {
            tt.reLaunch({
              url: '../index/index',
              success(res) {
                console.log(`跳转成功`);
              },
              fail(res) {
                console.log(`navigateTo调用失败`);
              },
            })
          }
        });
      },
      fail(info_res) {
        console.log('调用失败',info_res);
        _this.setData({
          loginStatus: false,
        });
        tt.showToast({
          title: "您拒绝了授权,无法访问您的用户数据",
          icon:"none",
          duration: 2000,
        });
      },
      withCredentials:true
    });
  },
  // 重新授权
  reAuth(){
    var _this = this;
    if(!this.data.loginStatus){
      tt.openSetting({
        success: function (open_res) {
          if(open_res) {
            if (open_res.authSetting["scope.userInfo"] == true) {
              _this.setData({
                loginStatus: true,
              });
              tt.getUserInfo({
                withCredentials: true,
                success: function (info_res) {
                  //console.info(info_res.userInfo);
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
    }else{
      this.login();
    }
  },
})