Page({
  data: {
    tabCate:[
      {
        id:"01",
        title:"全部"
      },
      {
        id:"02",
        title:"游戏"
      },
      {
        id:"03",
        title:"情感"
      },
      {
        id:"04",
        title:"性格"
      },
      {
        id:"05",
        title:"智商"
      },
      {
        id:"06",
        title:"职场"
      }
    ],
    tabCateContent:[
      {
        id:"01",
        cate:"全部",
        content:[
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
      {
        id:"02",
        cate:"游戏",
        content:[
          {
            id:"0201",
            img:"../../images/index_recommend.png",
            title:"你的EQ有多高？",
            info:"别再说富人越富、穷人越来越,别再说富人越富、穷人越来越",
            personNum:"10万",
          },
          {
            id:"0202",
            img:"../../images/index_chosen.png",
            title:"测测吧",
            info:"别再说富人越富、穷人越来越,别再说富人越富、穷人越来越",
            personNum:"20万",
          },
        ],
      },
    ],
    // tab 切换
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    }, 
  },
  onLoad: function () {
    console.log('分类')
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
  //tab切换
  tab: function (e) {
    //var dataId = e.currentTarget.dataset.id;
    var dataId = e.currentTarget.id;
    var obj = {};
    obj.curHdIndex = dataId;
    obj.curBdIndex = dataId;
    this.setData({
      tabArr: obj
    })
    //console.log(e);
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
              console.log(`${res}`);
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
  }
})