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
            img:"../../images/index_chosen.png",
            title:"你的情商有多高？你的情商有多高？",
            personNum:"1000万",
          },
          {
            id:"002",
            img:"../../images/index_chosen.png",
            title:"你的EQ有多高？",
            personNum:"20万",
          },
          {
            id:"003",
            img:"../../images/index_chosen.png",
            title:"测测吧？",
            personNum:"20万",
          },
        ],
      },
      {
        groupName:"B",
        id:"2",
        childrenItem:[
          {
            img:"../../images/index_recommend.png",
            title:"你在什么年龄容易发财？你在什么年龄容易发财？",
            personNum:"1000万",
          },
          {
            img:"../../images/index_recommend.png",
            title:"你的EQ有多高？",
            personNum:"20万",
          },
          {
            img:"../../images/index_chosen.png",
            title:"测测吧？",
            personNum:"20万",
          },
        ],
      }
    ],
    recommend:[],
  },
  onLoad: function () {
    this.getindexBanner();
    this.getindexCate();
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
        console.log(err)
      }
    })
  },
  // banner点击事件
  bannerTap(){

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
        console.log(err)
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
        //console.log(`${res}`);
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
              //console.log(`${res}`);
              console.log(`跳转成功`);
            },
            fail(res) {
              console.log(`navigateTo调用失败`);
            },
          })
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

  // 列表图片加载失败
  errImg(e){
    var _errImg = e.target.dataset.errImg;
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
