const app = getApp();
import http from '../../util/api' // 引入api接口管理文件
Page({
  data: {
    background: [
      "../../images/banner1.png", 
      "../../images/banner2.png", 
      "../../images/banner1.png", 
    ],
    indicatorDots: true,
    autoplay:false,

    indexCate:[
      {
        title:"游戏",
        icon:"../../images/game.png"
      },
      {
        title:"情感",
        icon:"../../images/game.png"
      },
      {
        title:"性格",
        icon:"../../images/game.png"
      },
      {
        title:"智商",
        icon:"../../images/game.png"
      },
      {
        title:"职场",
        icon:"../../images/game.png"
      },
    ],

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
    recommend:[
      {
        id:"111",
        img:"../../images/index_recommend.png",
        title:"你在什么年龄容易发财？你在什么年龄容易发财？",
        info:"别再说富人越富、穷人越来越",
        personNum:"1000万",
      },
      {
        id:"222",
        img:"../../images/index_chosen.png",
        title:"你的EQ有多高？",
        info:"别再说富人越富、穷人越来越,别再说富人越富、穷人越来越",
        personNum:"20万",
      },
      {
        id:"333",
        img:"../../images/index_recommend.png",
        title:"测测吧？",
        info:"别再说富人越富、穷人越来越",
        personNum:"20万",
      }, 
       {
        id:"111",
        img:"../../images/index_recommend.png",
        title:"你在什么年龄容易发财？你在什么年龄容易发财？",
        info:"别再说富人越富、穷人越来越",
        personNum:"1000万",
      },
      {
        id:"222",
        img:"../../images/index_chosen.png",
        title:"你的EQ有多高？",
        info:"别再说富人越富、穷人越来越,别再说富人越富、穷人越来越",
        personNum:"20万",
      },
      {
        id:"333",
        img:"../../images/index_recommend.png",
        title:"测测吧？",
        info:"别再说富人越富、穷人越来越",
        personNum:"20万",
      }, 
    ],
  },
  onLoad: function () {
    this.getindexCate()
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
  
  // 请求测试分类接口
  getindexCate(){
    http.indexCateApi({ // 调用接口，传入参数
      data: {
        xiaochengxu_id:"1",
      },
      success: res => {
        console.log('接口请求成功', res)
        this.setData({
          //indexCate: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
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
  }
})
