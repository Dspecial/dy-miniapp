Page({
  data: {
    index: 0,  // 题目序列
    chooseValue: [], // 选择的答案序列
    personNum:"100万",
    questionList: [
      {
        type:'1',
        question:"你何时会感受到痛苦?",
        options:[
          { value: "A", name: "不会",checked:false,score:"1"},
          { value: "B", name: "偶尔",checked:false},
          { value: "C", name: "经常",checked:false },
          { value: "D", name: "总是",checked:false }
        ],
      },
      {
        type:'1',
        question:"你一天吃几顿?",
        options:[
          { value: "A", name: "不会",checked:false,score:"1"},
          { value: "B", name: "两顿",checked:false},
          { value: "C", name: "三顿" ,checked:false},
          { value: "D", name: "四顿" ,checked:false},
          { value: "E", name: "更多",checked:false}
        ]
      },
      {
        type:'2',
        question:"你最喜欢的运动是什么?",
        options:[
          { value: "A", name: "排球",checked:false },
          { value: "B", name: "足球",checked:false},
          { value: "C", name: "篮球",checked:false},
          { value: "D", name: "竞走",checked:false},
          { value: "E", name: "跑步",checked:false},
          { value: "F", name: "跳绳",checked:false},
        ]
      },
      {
        type:'2',
        question:"你最喜欢的吃什么?",
        options:[
          { value: "A", name: "米饭" ,checked:false},
          { value: "B", name: "面条",checked:false},
          { value: "C", name: "煎饼",checked:false},
          { value: "D", name: "炒菜",checked:false},
          { value: "E", name: "烧烤",checked:false},
        ]
      },
      {
        type:'3',
        question:"您的姓名?",
        inputValue:"",
      },
      {
        type:'3',
        question:"您的年龄?",
        inputValue:"",
      },
      
    ],
  },
  onLoad: function (option) {
    //tt.setNavigationBarTitle({ title: option.id }) // 动态设置导航条标题
    console.log('测试问题页');
  },
   /*
  * 单选事件
  */
  radioChange: function(e){
    //console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.data.chooseValue[this.data.index] = e.detail.value;
    //console.log(this.data.chooseValue,'单选选项');

    // 记住上一题的答案
    this.previousAnswer(e.detail.value);
  },
  /*
  * 多选事件
  */
  checkboxChange:function(e){
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    this.data.chooseValue[this.data.index] = e.detail.value.sort();
    //console.log(this.data.chooseValue,'多选选项');

    // 记住上一题的答案
    this.previousAnswer(e.detail.value);
  },
  /*
  * 记住上一题的答案
  */
  previousAnswer:function(values){
    var items = this.data.questionList[this.data.index].options;
    for (var i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value == values[j]) {
          items[i].checked = true;
          break;
        }
      }
    }
    // 重新赋值questionList
    this.setData({
      questionList:this.data.questionList,
    })
  },

  /*
  * 填空事件
  */
  oninput: function (e) {
    //console.log('input获取焦点事件，携带value值为：', e.detail.value);
    this.data.chooseValue[this.data.index] = e.detail.value;
    //console.log(this.data.chooseValue,'填空答案');

    // 记住上一题的答案
    this.data.questionList[this.data.index].inputValue = e.detail.value;
    this.setData({
      questionList:this.data.questionList,
    })
  },
  onfocus: function (e) {
    console.log(e);
  },
  onblur: function (e) {
    tt.showToast({ title: "blur" });
  },

  /*
  * 上一题 按钮
  */
  prevTap:function(e){
    this.setData({
      index: this.data.index - 1,
    })
  },
  /*
  * 下一题/提交 按钮
  */
  nextSubmit: function(){
    // 如果没有选择
    if (this.data.chooseValue[this.data.index] == undefined || this.data.chooseValue[this.data.index].length == 0) {  
      tt.showToast({
        title: '请选择至少一个答案!',
        icon: 'none',
        duration: 2000,
        success: function(){
          return;
        }
      })
      return;
    }

    // 判断是不是最后一题
    if (this.data.index < this.data.questionList.length - 1) {
      // 渲染下一题
      this.setData({
        index: this.data.index + 1,
      })
    } else {
      let chooseValue = JSON.stringify(this.data.chooseValue);
      console.log("最后一题了",chooseValue);
      tt.redirectTo({
        url: '../../report/report?chooseValue='+ chooseValue,
        success(res) {
          //console.log(`${res}`);
          console.log(`跳转成功`);
        },
        fail(res) {
          console.log(`redirectTo调用失败`);
        },
      })

      // 设置缓存
      var logs = wx.getStorageSync('logs') || []
      let logsList = { "date": Date.now(), "testId": this.data.testId, "score": this.data.totalScore }
      logs.unshift(logsList);
      wx.setStorageSync('logs', logs);
    }
  },

  /*
  * 退出答题 按钮
  */
  outTest: function(){
    tt.showModal({
      title: '提示',
      content: '你真的要退出答题吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          tt.navigateBack();// 返回上一页
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


})