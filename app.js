import http from 'util/api' // 引入api接口管理文件
App({
  globalData:{
  },
  data:{
    timer:'',
  },
  onLaunch: function () {
    // 初次授权
    this.login();
    // 获取用户信息
    tt.getSetting({
      success: res => { 
        if (res.authSetting['scope.userInfo']) {
          clearInterval(this.data.timer);
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          tt.getUserInfo({
            success: res => {
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
        }
      }
    });
  },

  // 初次授权，加密
  login(){
    var that = this;
    tt.login({
      success(login_res) {
        tt.request({
          url: 'https://dy.weilaixxjs.cn/api/bytdance/auth/dylogin', // 目标服务器url
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
        console.log(login_res,'login调用失败');
        tt.showToast({
          icon:'fail',
          title: login_res.errMsg,
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
          url: 'https://dy.weilaixxjs.cn/api/bytdance/auth/dyinfo', // 目标服务器url
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
            clearInterval(_this.data.timer);
            tt.setStorageSync("openid", res.data.data); // 存到本地openid
          }
        });
      },
      fail(info_res) {
        console.log('调用失败',info_res);
        tt.showModal({
          title: "您拒绝了授权",
          content: "授权您的用户数据后才能正常访问",
          success(res) {
            if (res.confirm) {
              tt.openSetting({
                success: function (open_res) {
                  if(open_res) {
                    if (open_res.authSetting["scope.userInfo"] == true) {
                      tt.getUserInfo({
                        withCredentials: true,
                        success: function (info_res) {
                          _this.login();
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
            } else if (res.cancel) {
              // tt.reLaunch({
              //   url: '../authset/authset',// 去授权页面
              //   success(res) {
              //     console.log(`跳转成功`);
              //   },
              //   fail(res) {
              //     console.log(`navigateTo调用失败`);
              //   },
              // })
            } else {
              // what happend?
            }
          },
          fail(res) {
            console.log(`showModal调用失败`);
          },
        });
        _this.data.timer = setInterval(() => {
          tt.showToast({
            icon:'fail',
            title: '您没有授权',
            duration: 1000,
          });
        },10000);
      },
      withCredentials:true
    });
  },
  // 判断是否为空
  isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj == ""){
      return true;
    }else{
      return false;
    }
  },
  // 去测试页面
  linkToTest(id){
    var openid = tt.getStorageSync("openid");
    var _this = this;
    if(this.isEmpty(openid)){
      tt.showModal({
        title: "您拒绝了授权",
        content: "授权您的用户数据后才能正常访问",
        success(res) {
          if (res.confirm) {
            tt.openSetting({
              success: function (open_res) {
                if(open_res) {
                  if (open_res.authSetting["scope.userInfo"] == true) {
                    tt.getUserInfo({
                      withCredentials: true,
                      success: function (info_res) {
                        _this.login();
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
          } else if (res.cancel) {
            // tt.reLaunch({
            //   url: '../authset/authset',// 去授权页面
            //   success(res) {
            //     console.log(`跳转成功`);
            //   },
            //   fail(res) {
            //     console.log(`navigateTo调用失败`);
            //   },
            // })
          } else {
            // what happend?
          }
        },
        fail(res) {
          console.log(`showModal调用失败`);
        },
      });    
    }else{
      tt.showModal({
        title: "提示",
        content: "即将进入测试",
        success(res) {
          if (res.confirm) {
            tt.reLaunch({
              url: '../test/test?id='+id,
              success(res) {
                console.log(`跳转成功`);
              },
              fail(res) {
                console.log(`reLaunch调用失败`);
              },
            })
          } else if (res.cancel) {
            console.log("取消跳转");
          } else {
            // what happend?
          }
        },
        fail(res) {
          console.log(`showModal调用失败`);
        },
      });
    };

  },
})
