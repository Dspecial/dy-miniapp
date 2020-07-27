Page({
  data: {
    id:"",
    title:"你何时会感受到痛苦?",
    personNum:"100万",
    result:{
      key:"痛苦值",
      value:"50",
    },
    detail:"你何时会感受到痛苦，你何时会感受到痛苦，你何时会感受到痛苦，你何时会感受到痛苦。",
    recommend:[
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
  onLoad: function (option) {
    this.setData({
      id:option.id
    })
    // 拿到报告的id
    console.log(this.data.id);
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
  // 分享好友
  onShareAppMessage (option) {
    // option.from === 'button'
    return {
      title: '这是要转发的小程序标题',
      desc: '这是默认的转发文案，用户可以直接发送，也可以在发布器内修改',
      path: '/pages/index/index?from=sharebuttonabc&otherkey=othervalue', // ?后面的参数会在转发页面打开时传入onLoad方法
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
  
})