const app = getApp();
import http from '../../util/api' // 引入api接口管理文件
Page({
  data: {
    tabCate:[
    ],
    tabCateContent:{
    },
    // tab 切换
    curIndex:0,
    cateId:'',
  },
  onLoad: function (option) {
    if(option.id){
      this.setData({
        curIndex:option.index
      });
      this.getCategory(true);
      this.getCategoryList(option.id);
    }else{
      this.getCategory(false);
    }
  },
  // 请求测试分类接口
  getCategory(isIndex){
    http.categoryApi({ // 调用接口，传入参数
      success: res => {
        //console.log('分类接口请求成功', res)
        this.setData({
          tabCate: res.data
        })
        if(isIndex){
          console.log("从首页跳转过来的");
        }else{
          console.log("点击tab后");
          this.getCategoryList(this.data.tabCate[0].id);// 默认展示第一个
        } 
      },
      fail: err => {
        tt.showToast({
          title: err.msg,
          duration: 3000,
        });
      }
    })
  },
  // 请求测试分类列表接口
  getCategoryList(id){
    http.categoryListApi({ // 调用接口，传入参数
      data:{
        c_id:id
      },
      success: res => {
        //console.log('分类列表接口请求成功', res)
        this.setData({
          tabCateContent: res.data
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
  // 列表图片加载失败
  errImg(e){
    var _errImg = e.target.dataset.errImg;
    var _objImg = "'"+_errImg+"'";
    var _errObj = {};
    _errObj[_errImg]="../../images/imgError.png";
    this.setData(_errObj);//注意这里的赋值方式...
  },
  //tab切换
  tab: function (e) {
    var dataId = e.currentTarget.dataset.id;
    this.setData({
      curIndex: e.currentTarget.id
    })
    this.getCategoryList(dataId);// 切换展示
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