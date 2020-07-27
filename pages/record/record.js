Page({
  data: {
    porfile:{
      avatar_img:"../../images/avatar.png",
      name:"片刻安静",
      id:"77582558258"
    },
    recordsList:[
      {
        id:"001",
        createtime:"2020-07-11 18:00:00",
        finished:0,
        img:"../../images/avatar.png",
        title:"你在什么年龄容易发财",
        info:"别再说富人越富…",
        personNum:"100万",
      },
      {
        id:"002",
        createtime:"2020-07-20 18:00:00",
        finished:1,
        img:"../../images/avatar.png",
        title:"你在什么年龄容易发财",
        info:"别再说富人越富…",
        personNum:"100万",
      },
    ],
    
  },
  onLoad: function () {
    console.log('记录')
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

  linkTo(){
    console.log("点啦");
  },
  // 电话客服
  makePhoneCallTap (){
    tt.makePhoneCall({
      phoneNumber: "18888888888",
      success(res) {
        console.log(`makePhoneCall调用成功${res}`);
      },
      fail(res) {
        console.log(`makePhoneCall调用失败`);
      },
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
    var list = this.data.recordsList;
    var _this = this;
    tt.showModal({        
      content: '是否确定删除内容？',
      success: function (res) {
        if (res.confirm) {                  //点击确定后
          list.splice(index, 1);       //截取指定的内容
          _this.setData({               //重新渲染列表
            recordsList:list
          })
        }
      }
    })
  },
})