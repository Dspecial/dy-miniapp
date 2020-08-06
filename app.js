import http from 'util/api' // 引入api接口管理文件
App({
  globalData:{
  },
  data:{
    videoAd:tt.createRewardedVideoAd({
      adUnitId: '188pp92gc7lf3c1ajc'
    }),
    'is_end':0 //初始化广告播放状态
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

  // 看广告
  play_ad:function(id,itemID){
    var videoAd = this.data.videoAd
    // 显示广告
    videoAd
    .show()
    .then(() => {
      console.log("广告显示成功");
    })
    .catch((err) => {
      console.log("广告组件出现问题", err);
      // 可以手动加载一次
      videoAd.load().then(() => {
        console.log("手动加载成功");
        // 加载成功后需要再显示广告
        return videoAd.show();
      });
    });

    this.data.is_end = 0;//点击播放按钮重置播放状态

    var that = this;
    that.data.videoAd.onClose(res => {
      console.log(res,'广告');
      if (res.isEnded) {
        // 实现子子页面的closeAdFunction与cancelAdFunction方法
        if(that.data.is_end == 0){
          that.getAdvRecords(itemID);
          that.closeAdFunction(id);
          return;
        }
      } else {
        that.cancelAdFunction();
        return;
      }
    })
  },
  
  //广告监听，看完了
  closeAdFunction(id) {
    console.log('广告播放结束')
    this.data.is_end = 1;
    tt.showModal({
      title: "提示",
      content: "进入测试详情",
      success(res) {
        if (res.confirm) {
          tt.navigateTo({
            url: '../report/report?id='+id,
            success(res) {
              //console.log(`${res}`);
              console.log(`跳转成功`);
            },
            fail(res) {
              console.log(`navigateTo调用失败`);
            },
          });
        } else if (res.cancel) {
          console.log("cancel");
        } else {
          // what happend?
        }
      },
      fail(res) {
        console.log(`showModal调用失败`);
      },
    });
  },

  // 用户取消，没看完广告
  cancelAdFunction() {
    console.log('用户取消');
    tt.showToast({
      icon:"none",
      title: "看完广告拿到奖励，就可以看到报告了哦！",
      duration: 2000,
      success(res) {
        console.log(`${res}`);
      },
      fail(res) {
        console.log(`showToast调用失败`);
      },
    });
  },
  
  // 广告记录，计算佣金
  getAdvRecords(itemId){
    console.log(itemId);
    var openid = tt.getStorageSync("openid");
    http.porfileApi({
      data:{
        spread_code:'2007272203045460',// 先写死
        open_id:openid,
        item_id:itemId,
      },
      success: res => {
        console.log("成功",res);
      },
      fail: err => {
        tt.showToast({
          title: err.msg,
          duration: 3000,
        });
      }
    });
  },
})
