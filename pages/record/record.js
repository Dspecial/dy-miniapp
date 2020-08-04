const app = getApp();
import http from '../../util/api' // 引入api接口管理文件
Page({
  data: {
    porfile:{
      avatar_img:"../../images/avatar.png",
      name:"片刻安静",
      id:"77582558258"
    },
    mobile:"",
    recordsList:[
      {
        id:"001",
        createtime:"2020-07-11 18:00:00",
        finished:0,
        image:"../../images/avatar.png",
        matter_name:"你在什么年龄容易发财",
        brief:"别再说富人越富…",
        allnum:"100万",
      },
      {
        id:"001",
        createtime:"2020-07-11 18:00:00",
        finished:0,
        image:"../../images/avatar.png",
        matter_name:"你在什么年龄容易发财",
        brief:"别再说富人越富…",
        allnum:"100万",
      },
    ],
    
  },
  onLoad: function () {
    console.log(app.globalData.userInfo,'userInfo');
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
        //console.log(res,'用户信息')
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
        page:1,
      },
      success: res => {
        //console.log(res,'测评记录');
        var list = res.data.data;
        var array = [];
        list.map((item,index)=>{
          array.push(
            Object.assign(item,{finished:0})
          )
        });
        this.setData({
          recordsList: list
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
  // 查看报告
  viewReport(e){
    var item = e.currentTarget.dataset.binditem;  //获取自定义的内容下标值
    tt.navigateTo({
      url: '../report/report?id='+item.id,
      success(res) {
        //console.log(`${res}`);
        console.log(`跳转成功`);
      },
      fail(res) {
        console.log(`navigateTo调用失败`);
      },
    })
    console.log("查看报告");
  },
  // 删除报告 
  delReport(e){
    var index = e.currentTarget.dataset.index;  //获取自定义的内容下标值
    var _this = this;
    tt.showModal({        
      content: '是否确定删除内容？',
      success: function (res) {
        if (res.confirm) {//点击确定后          
          _this.getDelReport(index);
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
        console.log(res,'删除成功');
        _this.getRecordList();
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