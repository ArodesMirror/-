// miniprogram/pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户信息
    userInfo:{
      nickName:"请先登录"
    },
    //判断用户是否有登录。默认没有登录
    isLogin:false
  },
  //获取用户信息事件
  getUserInfo(){
    //调用接口获取用户信息
    wx.getUserProfile({
      desc:"获取头像及昵称",
      success:res => {
        console.log("登录成功==》",res)

        this.setData({
          userInfo:res.userInfo,
          isLogin:true
        })
        //授权登录成功，则修改本地缓存的登录数据
        wx.setStorage({
          data: true,
          key: 'isLogin',
        })
      },
      fail: err => {
        console.log("登录失败==》",err)
        wx.setStorage({
          data: false,
          key: 'isLogin',
        })
      }
    })
  },
  //跳转分类页
  tofenlei(){
    //如果用户没有登录，则不执行跳转页面功能
    // if(!this.data.islogin){
    //   return; //终止代码
    // }
    wx.navigateTo({
      url: '../classification/classification',
    })
  }
})