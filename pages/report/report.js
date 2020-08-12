const app = getApp();
import http from '../../util/api' // 引入api接口管理文件
Page({
  data: {
    id:"",
    itemID:'',
    details:{
    },
    isNotVideoOver:true, // 默认没看完广告
    videoAd:"",
    'is_end':0, //初始化广告播放状态
    video:'',
    recommend:[
    ],
  },
  onLoad: function (option) {
    this.setData({
      id:option.id,// 拿到报告的id
    })
    this.getReport(this.data.id);
    var _this = this;
    tt.getSystemInfo({
      success(res) {
        var version = res.system.split(" ")[1];
        if(res.appName == 'Douyin' || res.appName == 'devtools'){ // 只有抖音可以播放广告
          if(res.platform == 'android' && _this.judgeVersion(version,'10.3')){ // 只有安卓10.3以上才能播放广告
            _this.setData({
              isNotVideoOver:true,// 默认没看完广告
            })
          }else if(res.platform == 'ios' && _this.judgeVersion(version,'10.7')){ // 只有ios10.7以上才能播放广告
            _this.setData({
              isNotVideoOver:true,// 默认没看完广告
            })
          }else{
            _this.setData({
              isNotVideoOver:false,// 低版本不看广告
            })
          }
        }else{
          _this.setData({
            isNotVideoOver:false,// 其他宿主不看广告
          })
        }
      },
    });
  },

  // 判断版本号
  judgeVersion:function(curV, reqV) {
    var arr1 = curV.toString().split('.');
    var arr2 = reqV.toString().split('.');
    //将两个版本号拆成数字
    var minL = Math.min(arr1.length, arr2.length);
    var pos = 0; //当前比较位
    var diff = 0; //当前为位比较是否相等
    var flag = false;
    //逐个比较如果当前位相等则继续比较下一位
    while(pos < minL) {
      diff = parseInt(arr1[pos]) - parseInt(arr2[pos]);
      if(diff == 0) {
        pos++;
        continue;
      } else if(diff > 0) {
        flag = true;
        break;
      } else {
        flag = false;
        break;
      }
    }
    return flag;
  },

  // 获取测评详细和推荐
  getReport(id){
    http.reportApi({
      data:{
        id:id
      },
      success: res => {
        //console.log(res,'测评报告')
        this.setData({
          itemID:res.data.mid,
          details: res.data.details,
          recommend:res.data.recommend_list,
        })
      },
      fail: err => {
        tt.showToast({
          title: err.msg,
          duration: 3000,
        });
      }
    });
  },

  // 列表图片加载失败
  errImg(e){
    var _errImg = e.target.dataset.errImg;
    var _objImg = "'"+_errImg+"'";
    var _errObj = {};
    _errObj[_errImg]="../../images/imgError.png";
    this.setData(_errObj);//注意这里的赋值方式...
  },
  // 询问是否看广告，并告知佣金
  askPlay(){
    var _this = this;
    tt.showModal({
      title: "免费查看结果",
      content: "观看视频可以查看分析结果",
      success(res) {
        if (res.confirm) {
          _this.play_ad();
        } else if (res.cancel) {
          console.log("cancel, cold");
        } else {
          // what happend?
        }
      },
      fail(res) {
        console.log(`showModal调用失败`);
      },
    });
  },
  // 看广告
  play_ad:function(){
    this.setData({
      videoAd:tt.createRewardedVideoAd({
        adUnitId: '188pp92gc7lf3c1ajc'
      })
    })
    
    // 显示广告
    this.data.videoAd
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
    this.setData({
      is_end:0,//点击播放按钮重置播放状态
    });
    
    var that = this;
    this.data.videoAd.onClose(res => {
      console.log(res,'广告');
      if (res.isEnded) {
        // 实现子子页面的closeAdFunction与cancelAdFunction方法
        if(that.data.is_end == 0){
          that.getAdvRecords();
          that.closeAdFunction();
          return;
        }
      } else {
        that.cancelAdFunction();
        return;
      }
    })
  },
  
  //广告监听，看完了
  closeAdFunction() {
    console.log('广告播放结束')
    this.setData({
      is_end:1,
      isNotVideoOver:false,
    });
  },

  // 用户取消，没看完广告
  cancelAdFunction() {
    console.log('用户取消');
    this.setData({
      isNotVideoOver:true,
    });
    tt.showToast({
      icon:"none",
      title: "看完广告拿到奖励，就可以看到测试报告了哦！",
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
  getAdvRecords(){
    var openid = tt.getStorageSync("openid");
    http.porfileApi({
      data:{
        spread_code:tt.getStorageSync('spread_code'),// 先写死
        open_id:openid,
        item_id:this.data.itemID,
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
  
  // 去测试页面
  toTest:function(e){
    var item = e.currentTarget.dataset.binditem;
    tt.showModal({
      title: "提示",
      content: "即将进入测试",
      success(res) {
        if (res.confirm) {
          tt.navigateTo({
            url: '../test/test?id='+item.id,
            success(res) {
              console.log(`跳转成功`);
            },
            fail(res) {
              console.log(`navigateTo调用失败`);
            },
          })
        } else if (res.cancel) {
          //console.log("cancel, cold");
        } else {
          // what happend?
        }
      },
      fail(res) {
        console.log(`showModal调用失败`);
      },
    });
  },
  // 分享好友
  onShareAppMessage () {
    // option.from === 'button'
    return {
      title: this.data.details.matter_name,
      desc: this.data.details.title,
      path: '/pages/index/index?spread_code='+ tt.getStorageSync('spread_code'), // ?后面的参数会在转发页面打开时传入onLoad方法
      imageUrl: 'https://e.com/e.png', // 支持本地或远程图片，默认是小程序icon
      templateId: '这是开发者后台设置的分享素材模板id',
      success () {
        console.log('转发发布器已调起，并不意味着用户转发成功，微头条不提供这个时机的回调');
      },
      fail () {
        console.log('转发发布器调起失败');
      }
    }
  },
  // 拍个视频
  videoTap:function(){
    tt.chooseVideo({
      sourceType: ["camera"],
      compressed: true,
      success(res) {
        this.setData({
          video: res.tempFilePath,
        });

      },
      fail(res) {
        console.log(`chooseVideo调用失败`);
      },
    });
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    tt.showLoading({
      title: 'loading...',
      icon: 'loading'
    })
    setTimeout(() => {
      this.stopPullDownRefresh();
    }, 3000);
  },
  stopPullDownRefresh: function () {
    tt.stopPullDownRefresh({
      complete: function (res) {
        tt.hideLoading();
      }
    })
  },
  
})