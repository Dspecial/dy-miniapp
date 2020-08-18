const app = getApp();
import http from '../../util/api' // 引入api接口管理文件
Page({
  data: {
    id:"",
    type:"",
    index: 0,  // 题目序列
    chooseValue: [], // 选择的答案序列
    totalScore:0,
    personNum:"100万",
    questionList: [
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

    setTimeout(() => {
      this.nextSubmit(); // 选完答案，立即触发
    },200);
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
    //console.log(e);
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
      var logs = tt.getStorageSync('logs') || []
      let logsList = { "date": Date.now(), "testId": this.data.id, "score": this.data.totalScore }
      logs.unshift(logsList);
      tt.setStorageSync('logs', logs);
    }
  },

  // 提交答案
  commit(score){
    var openid = tt.getStorageSync("openid");
    http.questionCommitApi({ // 调用接口，传入参数
      data:{
        id:this.data.id,
        open_id:openid,
        score:score,
      },
      success: res => {
        //console.log('提交答案接口请求成功', res);
        tt.navigateTo({
          url: '../report/report?id='+res.data,
          success(res) {
            //console.log(`${res}`);
            console.log(`跳转成功`);
          },
          fail(res) {
            console.log(`navigateTo调用失败`);
          },
        });
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