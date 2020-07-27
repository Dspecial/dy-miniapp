Page({
  data: {
    isDefault:true,
    defaultImg:"../../images/empty.svg",
    searchList:[
      {
        id:"0101",
        img:"../../images/index_chosen.png",
        title:"你的EQ有多高？",
        info:"别再说富人越富、穷人越来越,别再说富人越富、穷人越来越",
        personNum:"1000万",
      },
      {
        id:"0102",
        img:"../../images/index_recommend.png",
        title:"你的EQ有多高？",
        info:"别再说富人越富、穷人越来越,别再说富人越富、穷人越来越",
        personNum:"20万",
      },
      {
        id:"0103",
        img:"../../images/index_chosen.png",
        title:"你的EQ有多高？",
        info:"别再说富人越富、穷人越来越,别再说富人越富、穷人越来越",
        personNum:"20万",
      },
    ],
  },
  onLoad: function () {
    console.log('搜索')
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
  // 搜索
  onconfirm(e){
    this.setData({
      isDefault: false,
    });
    //console.log(e.detail.value);

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
})