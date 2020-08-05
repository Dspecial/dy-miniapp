import http from '../../util/api' // 引入api接口管理文件
Page({
  data: {
    loginStatus:true,
  },
  onLoad: function () {
    console.log("用户授权");
    this.login();
  },
  // 初次授权，加密
  login(){
    var that = this;
    tt.login({
      success(login_res) {
        tt.request({
          url: 'http://dy.weilaixxjs.cn/api/bytdance/auth/dylogin', // 目标服务器url
          header: {
            'content-type': 'application/json',
            'token': "dd3e2f22a9e9f2dcf14c32628268963b", // token先写死
          },
          data:{
            code:login_res.code,
            xiaochengxu_id:1,
          },
          success: (res) => {
            that.getinfo(res.data.data.session_key);
          }
        });
      },
      fail(login_res) {
        console.log('login调用失败');
        tt.showToast({
          title: err.msg,
          duration: 3000,
        });
      }
    });
  },
  // 拿到用户信息，解密
  getinfo(sessionkey){
    var _this = this;
    tt.getUserInfo({
      success(info_res) {
        //console.log('getinfo调用成功',res);
        tt.request({
          url: 'http://dy.weilaixxjs.cn/api/bytdance/auth/dyinfo', // 目标服务器url
          header: {
            'content-type': 'application/json',
            'token': "dd3e2f22a9e9f2dcf14c32628268963b", // token先写死
          },
          data:{
            encryptedData:info_res.encryptedData,
            iv:info_res.iv,
            sessionKey:sessionkey,
            xiaochengxu_id:1
          },
          success: (res) => {
            tt.setStorageSync("openid", res.data.data); // 存到本地openid
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