const app = getApp();
import http from '../../util/api' // 引入api接口管理文件
Page({
  data: {
    imgError:false,
    id:"",
    type:"",
    coverimg:"",
    title:"",
    personNum:"",
    description:"",
    inputValue:"",
    _sex:'1',
    isValue:false,
    recommend:[],
  },
  onLoad: function (option) {
    if(option.spread_code && option.spread_code != undefined){
        tt.setStorageSync('spread_code', option.spread_code);
    }
    this.setData({
      id:option.id,// 拿到测试题型的id
    })
    this.getTest(this.data.id);
  },
  // 请求测试详情
  getTest(id){
    http.testApi({ // 调用接口，传入参数
      data:{
        id:id,
      },
      success: res => {
        var info = res.data.info;
        var recommendList = res.data.recommend_list;
        this.setData({
          type:info.is_typedata,//类型 为1代表选择题类型 2为填空类型
          coverimg:info.image,
          title:info.matter_name,
          personNum:info.number,
          description:info.brief,
          recommend:recommendList,
          placeholder:info.matter_title
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
  // 主图片加载失败
  imgLoadError(){
    this.setData({
      imgError:true
    });
  },
  // 列表图片加载失败
  errImg(e){
    var _errImg = e.target.dataset.errImg;
    var _objImg = "'"+_errImg+"'";
    var _errObj = {};
    _errObj[_errImg]="../../images/imgError.png";
    this.setData(_errObj);//注意这里的赋值方式...
  },
  // 开始测试，去问题页
  toQuestion:function(e){
    var testId = this.data.id;
    var testType = this.data.type; //类型 为1代表选择题类型 2为填空类型
    tt.navigateTo({
      url: '../question/question?id='+ testId + '&type=' + testType,
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
          // console.log("cancel, cold");
        } else {
          // what happend?
        }
      },
      fail(res) {
        console.log(`showModal调用失败`);
      },
    });
  },
  radioChange(e){
    this.setData({
      _sex:e.target.dataset.num,
    })
  },
  oninput: function (e) {
    console.log('input获取焦点事件，携带value值为：', e.detail.value);
    if(app.isEmpty(e.detail.value)){ // 为空
      this.setData({
        isValue:false,
      })
    }else{ // 不为空
      this.setData({
        isValue:true,
      })
    }
  },
  onfocus: function (e) {
    //console.log(e);
  },
  onblur: function (e) {
    tt.showToast({ title: "blur" });
  },
  // 没填姓名
  toDefault(){
    tt.showToast({ 
      icon:"fail",
      title: "还未填写！" 
    });
  },
  // 填了，去报告页面
  toReport:function(e){
    // 提交接口
    this.commit();
  },

  // 提交答案
  commit(){
    var openid = tt.getStorageSync("openid");
    http.questionCommitApi({ // 调用接口，传入参数
      data:{
        id:this.data.id,
        open_id:openid,
      },
      success: res => {
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
})