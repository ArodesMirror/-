// miniprogram/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr:["a","b","c","d","e"],
    currentMonth:"", //当前选中的月份，默认是当月
    //某月的总收入和总支出
    monthCost:{
      pay:0,
      income:0
    },
    //某月结余金额
    surPlus:"0,00",
    //某月的消费数据
    monthArr:[],
    //判断月份是否有数据，默认没有
    hasData:false,
    isOnload:true, //判断页面是否首次进入，默认是
    //判断用户是否登录
    islogin:false
  },
  onLoad(){
    // console.log("页面加载")
    //调用函数，获取当月日期
    this.getMonth();

    // console.log("2021-01-20"<"2020-04-19")

    //从本地缓存中获取当前用户登录状态
    wx.getStorage({
      key:"isLogin",
      success: res => {
        console.log(res)
        if(res.data){
          //用户已经登录，获取数据
          //调用函数，获取当月数据
          this.getMsgData(this.data.currentMonth)

          this.setData({
            islogin:true
          })
        }else{
          wx.showToast({
            title:"还没登录哦！！",
            icon:"none",
            mask:true
          })
        }
      }
    })
  },
   /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log("页面显示")

    if(this.data.isOnload){
      //条件成立则说明，页面是首次进入
      this.data.isOnload = false;
    }else{
      //调用函数，获取当月日期
      this.getMonth();

      //从本地缓存中获取当前用户登录状态
      wx.getStorage({
        key:"isLogin",
        success:res => {
          if(res.data){
            //用户已经登录，获取数据
            //调用函数，获取当月数据
            this.getMsgData(this.data.currentMonth);

            this.setData({
              islogin:true
            })
          }
        }
      })
    }
  },
  //跳转到记账页面
  toRecord(){
    //如果用户没有登录，则不执行跳转页面功能
    if(!this.data.islogin){
      return; //终止代码
    }
    wx.navigateTo({
      url: '../record/record',
    })
  },
  //获取当月信息函数
  getMonth(){
    //获取时间对象
    var time = new Date();
    //获取年份
    var y = time.getFullYear();
    //获取月份
    var m = time.getMonth() + 1;
    //数据响应
    this.setData({
      currentMonth : this.addZero(m) + "/" + y
    })
  },
  //补零函数
  addZero(num){
    return num <10 ? "0" + num : num
  },
  //选择月份事件
  selectMonth(e){
    var monArr = e.detail.value.split("-");
    console.log(monArr)
    //数据响应
    this.setData({
      currentMonth:monArr[1] + "/" + monArr[0]
    })
    //根据选中月份获取对应数据
    this.getMsgData(this.data.currentMonth);
  },
  //获取某月数据
  getMsgData(month){
    //获取月份数据原理：只要数据库集合的数据日期在要查询的月份的1号到该月的最后一天，则该条数据就是该月数据
    //如何判断该日期是否在范围之内
    //只要该条数据的日期大于等于该月的1号并且小于等于该月最后一天的日期，则说明该日期在范围之内
    // console.log(month)
    var dateArr = month.split("/")
    //获取查询月份的第一天日期
    var start = dateArr[1] + "-" + dateArr[0] + "-01";
    console.log("当月的第一天："+start)
    //获取当月有对少天
    var dayNum = new Date(dateArr[1],dateArr[0],0).getDate();
    //获取查询月份的最后一天日期
    var end = dateArr[1] + "-" + dateArr[0] + "-" + dayNum;
    console.log("当月的最后一天："+end)

    //清空月份总收入和总支出，确保每次累加金额的时候是从0开始累加
    this.data.monthCost.pay = 0;
    this.data.monthCost.income = 0;
    //显示加载框
    wx.showLoading({
      title: '正在加载...',
      mask:true
    })
    //清空本地缓存
    // wx.clearStorage();
    //调用云函数
    wx.cloud.callFunction({
      name:"get_msg_data",
      data:{
        startTime:start,
        endTime:end
      },
      success:res =>{
        console.log("获取数据成功==》",res)
        //数据获取成功，关闭加载框
        wx.hideLoading();
        //获取返回的数据
        var data = res.result.data;
        // console.log(data)

        //判断是否有数据，如果没有则数据长度为0
        if(data.length == 0){
          //条件成立则说明没有数据
          this.data.hasData = false;
        }else{
          this.data.hasData = true;
        }

        //时间数组，存放一个与在哪天有消费记录
        var timeArr = [];

        //存放一个月的每天消费数据
        var monthData = [];
        //遍历数据累加总收入和总支出
        data.forEach(v => {
          //将每条数据存储在本地缓存中
          wx.setStorage({
            data: v,
            key: v._id,
          })

          //遍历数据获取消费日期，如果该日期不存在timeArr里，则说明该日期是第一次消费，如果存在则说明该日期不是第一次消费，则不需要添加到timeArr上
          //timeArr主要存放一个月里用户在哪天有消费的日期
          //indexOf(查询的元素) 数组/字符串查询元素的方法，如果数组/字符串存在该查询元素，则返回元素对应的下标，反之不存在则返回 -1
          if(timeArr.indexOf(v.date) == -1){
            timeArr.push(v.date)
          }

          this.data.monthCost[v.costType] += Number(v.money);
        })
        //累加完成后计算结余金额 
        var surNum = this.data.monthCost.income - this.data.monthCost.pay;
        //强制总收入和总支出保留两个小数位
        //toFixed() 强制保留小数位方法，调用者一定要是数值类型
        this.data.monthCost.pay = Number(this.data.monthCost.pay).toFixed(2);
        this.data.monthCost.income = Number(this.data.monthCost.income).toFixed(2);
        //将时间数组的日期从大到小排序
        //sort() 数组的排序方法，默认按字符的大小从小到大进行排序
        //reverse() 颠倒数组顺序方法
        timeArr.sort().reverse();
        // console.log(timeArr)
        //遍历时间数组，根据时间产生对应数组
        timeArr.forEach( v => {
          var dayData = {};
          //获取日期
          var arr = v.split("-");
          dayData.date = arr[0] + "年" + Number(arr[1]) + "月" + Number(arr[2]) + "日";
          //根据日期获取星期
          switch(new Date(v).getDay()){
            case 0:
              dayData.week = "星期日";
            break;
            case 1:
              dayData.week = "星期一";
            break;  
            case 2:
              dayData.week = "星期二";
            break;
            case 3:
              dayData.week = "星期三";
            break;  
            case 4:
              dayData.week = "星期四";
            break;
            case 5:
              dayData.week = "星期五";
            break;  
            case 6:
              dayData.week = "星期六";
            break;
          }
          //获取一天的总收入和总支出
          dayData.pay = 0;
          dayData.income = 0;
          //存放一天里所有的消费记录
          dayData.info = [];
          //遍历数据，获取对应日期的数据
          data.forEach( x => {
            //x:当前数据
            if(v == x.date){
              //条件成立则说明当前数据是当前日期的数据
              dayData.info.push(x);
              dayData[x.costType] += Number(x.money);
            }
          })
          //累加完成后强制保留两个小数位
          dayData.pay = dayData.pay.toFixed(2);
          dayData.income = dayData.income.toFixed(2);
          // console.log(dayData)

          //将一天的消费数据添加到monthData
          monthData.push(dayData)
        })
        console.log(monthData)
        //数据响应
        this.setData({
          monthCost:this.data.monthCost,
          surPlus:surNum.toFixed(2),
          monthArr:monthData,
          hasData:this.data.hasData
        })

      },
      fail:err =>{
        console.log("获取数据失败==》",err)
      }
    })
  },
  //跳转到详情页面
  navToDetail(e){
    console.log(e)
    //获取当前点击的数据对应的_id
    var id = e.currentTarget.dataset.index;
    //跳转到详情页
    wx.navigateTo({
      url: "../detail/detail?_id=" + id,
    })
  }
})
// [ 
//   //一个对象代表一天的消费记录
//   {
//     data:"2021年5月11日",
//     week:"星期二",
//     pay:"128.00", //一天的总支出
//     income:"0.00", //一天的总收入
//     info:[] //一天的所有消费记录
//   },
//   {
//     data:"2021年5月09日",
//     week:"星期日",
//     pay:"128.00", //一天的总支出
//     income:"0.00", //一天的总收入
//     info:[] //一天的所有消费记录
//   }
// ]