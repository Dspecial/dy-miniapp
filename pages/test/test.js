Page({
  data: {
    id:"",
    coverimg:"../../images/test_cover.png",
    title:"你会经历几段感情？",
    personNum:"100万",
    description:"测试说明测试说明测试说明测试说明测试说明测试说明测试说明测试说明测试说明测试说明测试说明测试说明",
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
    console.log('测试引导页')
    this.setData({
      id:option.id,// 拿到测试题型的id
    })
  },
  // 开始测试，去问题页
  toQuestion:function(e){
    var testId = this.data.id;
    console.log(testId);
    tt.navigateTo({
      url: '../test/question/question?id='+ testId,
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