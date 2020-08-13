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
    option:'',
  },
  onLoad: function (option) {
    if(option.spread_code && option.spread_code != undefined){
      tt.setStorageSync('spread_code', option.spread_code);
    }
    this.setData({
      option:option,
    })
    // 页面
    this.getindexBanner();
    this.getindexCate();
    this.getToday();
    this.getindexRecommend();
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
    app.linkToTest(item.id);
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
    this.onLoad(this.data.option);
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
