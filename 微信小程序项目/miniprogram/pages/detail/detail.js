// miniprogram/pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //数据
      info:{},
      //修改后的新数据
      newData:{},
      //时间
      time:'',
  },

  //获取修改后的数据
  getNewDate(e){
    // console.log('e==>：',e)
    //获取修改数据对应的类型
    var type = e.currentTarget.dataset.type
    // console.log('type==>',type)
    //将修改后的数据放入新数据集合中
    this.data.newData[type] = e.detail.value
    console.log('newData==>',this.data.newData)
    //如果修改的是时间
    if(type == 'date'){
      this.setData({
        time:e.detail.value
      })
    }
  },
  //编辑数据事件
  setMsgData(){

    //判断newData是否有数据，如果有数据则说明修改了，且修改后的数据不能和原数据相同，再调用云函数
    var ischange = false
    //循环遍历newData对象
    for(var key in this.data.newData){
      if(this.data.newData[key] != this.data.info[key]){
        ischange = true
      }
    }
    if(ischange){
      console.log('数据修改了且和原数据不相等')

      //调用云函数
      wx.cloud.callFunction({
      name:"update_msg_data",
      data:{
        id:this.data.info._id,
        newData:this.data.newData
      },
      success:res => {
        console.log('编辑数据成功==>',res)
        //返回首页
        wx.navigateBack()
      },
      fail:err => {
        console.log('编辑数据失败==>',err)
      }
    })
    }else{
      console.log('数据未修改或和原数据相同')
    }
  },

  //删除编辑事件
  deleteMsgData(){
    //调用云函数
    wx.cloud.callFunction({
      name:"delete_msg_data",
      data:{
        id:this.data.info._id
      },
      success:res => {
        console.log('删除数据成功==>',res)
        //返回首页
        wx.navigateBack()
      },
      fail:err => {
        console.log('删除数据失败==>',err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options==>",options)

    //根据传递过来的数据在本地缓存中获取数据
    wx.getStorage({
      key:options._id,
      success:res => {
        console.log(res)
        //数据响应
        this.setData({
          info:res.data,
          time:res.data.date
        })
      }
    })
  }
})
