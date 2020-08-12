const app = getApp();
import http from '../../util/api' // 引入api接口管理文件
Page({
  data: {
    isAuthorize:false,
    banner: [
      {
        id:"1",
        is_typedata:"2",
        image:"../../images/banner1.png"
      },
    ],
    indicatorDots: true,
    autoplay:false,
    indexCate:[],
    today_chosen:[
      {
        groupName:"A",
        id:"1",
        childrenItem:[
          {
            id:"001",
            image:"../../images/index_chosen.png",
            matter_name:"你的情商有多高？你的情商有多高？",
            allnum:"1000万",
          }
        ]
      },
      {
        groupName:"B",
        id:"2",
        childrenItem:[

        ],
      }
    ],
    recommend:[],
    loginStatus:true, // 授权
  },
  onLoad: function (option) {
    if(option.spread_code && option.spread_code != undefined){
      tt.setStorageSync('spread_code', option.spread_code);
    }
    // 授权
    this.login();
    // 页面
    this.getindexBanner();
    this.getindexCate();
    this.getToday();
    this.getindexRecommend();
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
            // 展示tabbar
            tt.showTabBar({
              animation: true,
            });
            tt.setStorageSync("openid", res.data.data); // 存到本地openid
          }
        });
      },
      fail(info_res) {
        console.log('调用失败',info_res);
        _this.setData({
          loginStatus: false,
        });
        // 隐藏tabbar
        tt.hideTabBar({
          animation: true,
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
                  // 展示tabbar
                  tt.showTabBar({
                    //animation: true,
                  });
                  //console.info(info_res.userInfo);
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

  // 请求banner接口
  getindexBanner(){
    http.indexBannerApi({ // 调用接口，传入参数
      success: res => {
        this.setData({
          banner: res.data
        })
      },
      fail: err => {
        tt.showToast({
          title: err.msg,
          duration: 3000,
        });
      }
    })
  },

  // 请求首页测试分类接口
  getindexCate(){
    http.indexCateApi({ // 调用接口，传入参数
      success: res => {
        this.setData({
          indexCate: res.data
        })
      },
      fail: err => {
        tt.showToast({
          title: err.msg,
          duration: 3000,
        });
      }
    })
  },
  // 去分类页面
  goCategory(e){
    var cateId = e.currentTarget.dataset.id;
    var curindex =  e.currentTarget.dataset.index
    tt.reLaunch({
      url: '../category/category?id='+cateId +'&index='+curindex,// tab切换active的值先用curindex，回头再想办法
      success(res) {
        console.log(`跳转成功`);
      },
      fail(res) {
        console.log(`navigateTo调用失败`);
      },
    })
  },
  // 请求今日精选
  getToday(){
    http.indexTodayApi({
      success: res => {
        this.setData({
          'today_chosen[0].childrenItem': res.data.arr1,
          'today_chosen[1].childrenItem': res.data.arr2,
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

  // 请求首页推荐接口
  getindexRecommend(){
    http.indexRecommendApi({ 
      success: res => {
        this.setData({
          recommend: res.data
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
  // 去搜索页面
  indexSearch: function(){
    tt.navigateTo({
      url: '../search/search',
      success(res) {
        console.log(`跳转成功`);
      },
      fail(res) {
        console.log(`navigateTo调用失败`);
      },
    })
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
          console.log("取消跳转");
        } else {
          // what happend?
        }
      },
      fail(res) {
        console.log(`showModal调用失败`);
      },
    });
  },

  // 列表图片加载失败
  errImg(e){
    var _errImg = e.target.dataset.errImg;
    console.log(_errImg);
    var _objImg = "'"+_errImg+"'";
    var _errObj = {};
    _errObj[_errImg]="../../images/imgError.png";
    this.setData(_errObj);//注意这里的赋值方式...
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
  // 上拉加载
  // onReachBottom () {
  //   tt.showLoading({
  //     title: 'loading...',
  //     icon: 'loading'
  //   })
  //   setTimeout(() => {
  //     this.stopPullDownRefresh();
  //   }, 3000);
  // },
})
