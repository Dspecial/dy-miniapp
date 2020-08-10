const app = getApp();
import http from '../../util/api' // 引入api接口管理文件
Page({
  data: {
    porfile:{
    },
    mobile:"",
    recordsList: [], //放置返回数据的数组
    isListEmpty: true,   // 用于判断recordsList数组是不是空数组，默认true，空的数组
    pageNum: 1,   // 设置加载的第几次，默认是第一次
    limit: 5,      //返回数据的个数
    loading: false, //"上拉加载"的变量，默认false，隐藏
    loadingComplete: false,  //“没有数据”的变量，默认false，隐藏
  },
  onLoad: function () {
    //console.log(app.globalData.userInfo,'userInfo'); // 这也可以获取头像和姓名,只是没有id
    this.getProfile();
    this.getMobile();
    this.getRecordList();
  },

  // 获取个人信息
  getProfile(){
    var openid = tt.getStorageSync("openid");
    http.porfileApi({
      data:{
        open_id:openid,
      },
      success: res => {
        this.setData({
          porfile: res.data
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
  // 获取电话号码
  getMobile(){
    http.mobileApi({
      success: res => {
        //console.log(res,'电话号码')
        this.setData({
          mobile: res.data
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
  linkTo(){
    console.log("点啦");
  },
  // 跳转到商务合作页面
  linkToCooperation(){
    tt.navigateTo({
      url: '../cooperation/cooperation',
      success(res) {
        console.log(`跳转成功`);
      },
      fail(res) {
        console.log(`navigateTo调用失败`);
      },
    })
  },
  // 电话客服
  makePhoneCallTap (){
    tt.makePhoneCall({
      phoneNumber: this.data.mobile,
      success(res) {
        console.log(`makePhoneCall调用成功${res}`);
      },
      fail(res) {
        console.log(`makePhoneCall调用失败`);
      },
    });
  },

  // 获取测评记录
  getRecordList(){
    var openid = tt.getStorageSync("openid");
    http.recordListApi({
      data:{
        open_id:openid,
        page:this.data.pageNum,
      },
      success: res => {
        //console.log(res,'测评记录');
        if(res.data.data.length != 0){
          let searchList = [];
          //如果isListEmpty是true从data中取出数据，否则先从原来的数据继续添加
          this.data.isListEmpty ? searchList = res.data.data : searchList = this.data.recordsList.concat(res.data.data)
          this.setData({
            limit:res.data.per_page,
            recordsList: searchList, //获取数据数组
            loading: true   //把"上拉加载"的变量设为false，显示
          });
          if(res.data.data.length < this.data.limit){
            this.setData({
              loadingComplete: true, //把“没有数据”设为true，显示
              loading: false  //把"上拉加载"的变量设为false，隐藏
            });
          }
          //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
        }else{
          this.setData({
            loadingComplete: true, //把“没有数据”设为true，显示
            loading: false  //把"上拉加载"的变量设为false，隐藏
          });
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
  
  // 上拉加载
  onReachBottom () {
    if(this.data.loading && !this.data.loadingComplete){
      this.setData({
        pageNum: this.data.pageNum+1,  //每次触发上拉事件，把pageNum+1
        isListEmpty: false  //触发到上拉事件，把isListEmpty设为为false
      });
      tt.showLoading({
        title: 'loading...',
        icon: 'loading'
      })
      setTimeout(() => {
        this.stopPullDownRefresh();
        this.getRecordList();
      }, 2000);
    }
  },

  // 查看报告
  viewReport(e){
    var item = e.currentTarget.dataset.binditem;  //报告的id
    
    tt.navigateTo({
      url: '../report/report?id='+item.id,
      success(res) {
        //console.log(`${res}`);
        console.log(`跳转成功`);
      },
      fail(res) {
        console.log(`navigateTo调用失败`);
      },
    });
  },

  // 删除报告 
  delReport(e){
    var index = e.currentTarget.dataset.index;  //获取自定义的内容下标值
    var _this = this;
    tt.showModal({        
      content: '是否确定删除内容？',
      success: function (res) {
        if (res.confirm) {//点击确定后
          tt.showLoading({
            title: '删除中...',
            icon: 'loading'
          })
          setTimeout(() => {
            _this.getDelReport(index);
          }, 2000);
        }
      }
    })
  },
  // 获取删除报告接口
  getDelReport(id){
    var _this = this;
    http.delreportApi({
      data:{
        id:id
      },
      success: res => {
        var list = _this.data.recordsList;
        //找到要删除的订单id的index
        list.map(function(item,index){
          if (item.id == id ){
            list.splice(index, 1);
          }
        })
        _this.setData({
          recordsList: list//更新
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

  // 下拉刷新
  onPullDownRefresh: function () {
    tt.showLoading({
      title: 'loading...',
      icon: 'loading'
    })
    setTimeout(() => {
      this.onLoad();
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