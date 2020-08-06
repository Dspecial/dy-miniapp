const app = getApp();
import http from '../../util/api' // 引入api接口管理文件
Page({
  data: {
    form_info:"",//用来清空
  },
  onLoad: function () {

  },
  
  formSubmit(e){
    var openid = tt.getStorageSync("openid");
    var name = e.detail.value.name;
    var fans_number = e.detail.value.fans_number;
    var u_name = e.detail.value.u_name;
    var contact_method = e.detail.value.contact_method;
    http.cooperationApi({
      data:{
        open_id:openid,
        name:name,
        fans_number:fans_number,
        u_name:u_name,
        contact_method:contact_method,
      },
      success: res => {
        if(res.code == 0){
          setTimeout(() => {
            tt.showToast({
              title: res.msg,
              duration: 3000,
            });
          }, 1000);
          setTimeout(() => {
            this.setData({
              form_info:'',
            });
          },2000)
        }else{
          setTimeout(() => {
            tt.showToast({
              icon:'none',
              title: res.msg,
              duration: 3000,
            });
          }, 100);
        }
      },
      fail: err => {
        tt.showToast({
          title: err.msg,
          duration: 3000,
        });
      }
    });
  },
  //表单重置
  formReset(){
    console.log('重置')
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
})