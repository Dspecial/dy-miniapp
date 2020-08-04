import http from '../../../util/api' // 引入api接口管理文件
Page({
  data: {
    id:"",
    type:"",
    index: 0,  // 题目序列
    chooseValue: [], // 选择的答案序列
    totalScore:0,
    personNum:"100万",
    questionList: [
      {
        type:'1',
        question:"你何时会感受到痛苦?",
        se:[
          { value: "A", val:"5",name: "不会",checked:false,score:"1"},
          { value: "B", val:"10",name: "偶尔",checked:false},
          { value: "C", val:"15",name: "经常",checked:false },
          { value: "D", val:"20",name: "总是",checked:false }
        ],
      },
      {
        type:'1',
        question:"你一天吃几顿?",
        se:[
          { value: "A", val:"5",name: "不会",checked:false,score:"1"},
          { value: "B", val:"15",name: "两顿",checked:false},
          { value: "C", val:"20",name: "三顿" ,checked:false},
          { value: "D", val:"25",name: "四顿" ,checked:false},
          { value: "E", val:"30",name: "更多",checked:false}
        ]
      },
      {
        type:'1',
        question:"你最喜欢的运动是什么?",
        se:[
          { value: "A", val:"5",name: "排球",checked:false },
          { value: "B", val:"15",name: "足球",checked:false},
          { value: "C", val:"10",name: "篮球",checked:false},
          { value: "D", val:"13",name: "竞走",checked:false},
          { value: "E", val:"12",name: "跑步",checked:false},
          { value: "F", val:"11",name: "跳绳",checked:false},
        ]
      },
      // {
      //   type:'2',
      //   question:"你最喜欢的吃什么?",
      //   se:[
      //     { value: "A", name: "米饭" ,checked:false},
      //     { value: "B", name: "面条",checked:false},
      //     { value: "C", name: "煎饼",checked:false},
      //     { value: "D", name: "炒菜",checked:false},
      //     { value: "E", name: "烧烤",checked:false},
      //   ]
      // },
      // {
      //   type:'3',
      //   question:"您的姓名?",
      //   inputValue:"",
      // },
      // {
      //   type:'3',
      //   question:"您的年龄?",
      //   inputValue:"",
      // },
    ],
  },
  onLoad: function (option) {
    //tt.setNavigationBarTitle({ title: option.id }) // 动态设置导航条标题
    this.setData({
      id:option.id,// 拿到测试题型的id
      type:option.type,// 拿到测试题型的类型。为1代表选择题类型 2为填空类型
    })
    this.getQuestionList(this.data.id);
  },
  // 获取测试问题列表
  getQuestionList(id){
    http.questionApi({ // 调用接口，传入参数
      data:{
        id:id,
      },
      success: res => {
        //console.log('问题列表接口请求成功', res);
        var list = res.data.list;
        var array = [];
        list.map((item,index)=>{
          array.push(
            Object.assign(item,{type:this.data.type})
          )
        });
        this.setData({
          personNum:res.data.number,
          questionList:list,
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
  
   /*
  * 单选事件
  */
  radioChange: function(e){
    //console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.data.chooseValue[this.data.index] = e.detail.value;
    // console.log(this.data.chooseValue,'单选选项');
    // 记住上一题的答案
    this.radioPreviousAnswer(e.detail.value);
  },
  /*
  * 单选记住上一题的答案
  */
  radioPreviousAnswer:function(values){
    var items = this.data.questionList[this.data.index].se;
    for (var i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false;
      if (items[i].val == values) {
        items[i].checked = true;
        break;
      }
    }
    // 重新赋值questionList
    this.setData({
      questionList:this.data.questionList,
    })
  },
  /*
  * 多选事件
  */
  checkboxChange:function(e){
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    this.data.chooseValue[this.data.index] = e.detail.value.sort();
    // 记住上一题的答案
    this.checkboxPreviousAnswer(e.detail.value);
  },
  /*
  * 多选记住上一题的答案
  */
  checkboxPreviousAnswer:function(values){
    var items = this.data.questionList[this.data.index].se;
    for (var i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].val == values[j]) {
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
      let scoreArr = this.data.chooseValue.map(Number);
      var score = 0;
      scoreArr.forEach(ele => {
        score += ele;
      });
      // 提交接口
      this.commit(score);

      this.setData({
        totalScore:score
      });
      // 设置缓存
      var logs = wx.getStorageSync('logs') || []
      let logsList = { "date": Date.now(), "testId": this.data.id, "score": this.data.totalScore }
      logs.unshift(logsList);
      wx.setStorageSync('logs', logs);
    }
  },

  // 提交答案
  commit(score){
    http.questionCommitApi({ // 调用接口，传入参数
      data:{
        id:this.data.id,
        open_id:"1", // 不知道是个啥
        score:score,
      },
      success: res => {
        console.log('提交答案接口请求成功', res);
        // ...这里还要调广告
        // tt.redirectTo({
        //   url: '../../report/report?totalScore='+ score,
        //   success(res) {
        //     //console.log(`${res}`);
        //     console.log(`跳转成功`);
        //   },
        //   fail(res) {
        //     console.log(`redirectTo调用失败`);
        //   },
        // })
      },
      fail: err => {
        tt.showToast({
          title: err.msg,
          duration: 3000,
        });
      }
    })
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