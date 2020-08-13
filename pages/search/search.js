const app = getApp();
import http from '../../util/api' // 引入api接口管理文件
Page({
  data: {
    isDefault:true,
    defaultImg:"../../images/empty.svg",
    searchList:[
    ],
  },
  onLoad: function () {
    console.log('搜索');
  },
  
  //获取搜索列表
  getSearch(keyword){
    http.searchApi({
      data:{
        keyword:keyword
      },
      success: res => {
        if(res.data.length == 0){
          this.setData({
            isDefault: true,
          });
        }else{
          this.setData({
            searchList: res.data,
          })
        }
      },
      fail: err => {
        tt.showToast({
          title: err.msg,
          duration: 3000,
        });
      }
    });
  },
  // 搜索
  onconfirm(e){
    this.setData({
      isDefault: false,
    });
    this.getSearch(e.detail.value)
  },

  // 列表图片加载失败
  errImg(e){
    var _errImg = e.target.dataset.errImg;
    var _objImg = "'"+_errImg+"'";
    var _errObj = {};
    _errObj[_errImg]="../../images/imgError.png";
    this.setData(_errObj);//注意这里的赋值方式...
  },
  
  // 去测试页面
  toTest:function(e){
    var item = e.currentTarget.dataset.binditem;
    app.linkToTest(item.id);
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
  onReachBottom () {
    tt.showLoading({
      title: 'loading...',
      icon: 'loading'
    })
    setTimeout(() => {
      this.stopPullDownRefresh();
    }, 3000);
  },
})