// miniprogram/pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      //收入支出标题数据
      costTitle:[
        {
          name:"支出",
          type:"pay",
          isAct:true
        },
        {
          name:"收入",
          type:"income",
          isAct:false
        }
      ],
      arr:[
        [1,2,3,4,5,6,7,8],
        [1,2,3,4,5,6,7,8],
        [1,2,3,4,5,6,7,8],
        [1,2,3,4,5]
      ],
      //轮播图数据
      bannerIcon:{
        pay:[],
        income:[]
      },
      //激活的图标信息
      actIcon:{
        type:'',  //图标类型
        index:'', //图标对应的滑块下标
        id:'' //图标对应的下标
      },
      //当天日期
      currentDate:'',
      //用户填写金额 日期 备注信息
      info:{
        money:"", //金额
        date:"",  //日期
        comment:""  //备注
      },
      //轮播图默认显示第一个滑块
      currentNum:0,
      //当天日期
      today:""
  },
  /*
   *生命周期函数--监听页面加载
   */
  onLoad:function(options){
    //调用函数，获取图标数据
    this.getIcon();

    //调用函数，获取当天日期
    this.getToday();
  },
  //标题点击切换事件
  // titleTap:function{} es5
  titleTap(e){
    //e：事件对象event
    console.log("e=====",e)
    //获取当前点击的标题对应的下标
    var index = e.currentTarget.dataset.index;
    // console.log(index)
    console.log(this.data)
    //取消上一个激活的标题
    for(var i = 0;i < this.data.costTitle.length; i++){
      //第一种：设置所有标题数据都为非激活状态[[仅适用于数据较少的时候]]
      // this.data.costTitle[i].isAct = false;
      //第二种：查找激活的数据，将该数据设置为非激活状态
      if(this.data.costTitle[i].isAct){
        this.data.costTitle[i].isAct = false;
        break;  //找到激活的数据则终止循环不再查找
      }
    }
    //设置当前点击标题为激活状态
    this.data.costTitle[index].isAct = true;
    //数据响应，更新视图层的对应数据
    this.setData({
      costTitle:this.data.costTitle
    })
    // console.log(this.data.costTitle)
  },
  //获取轮播图数据
  getIcon(){
    //调用云函数
    wx.cloud.callFunction({
      name:"get_icon",
      success: res =>{
        // console.log("获取图标数据成功==》",res)
        //获取返回的数据
        var data = res.result.data;
        // console.log(data)
        //将数据分类，根据收入支出分
        var banner = {
          pay: [],  //存放支出图标
          income: []  //存放收入图标
        }

        //遍历数据，判断数据是收入还是支出
        data.forEach(v =>{
          //给数据添加一个激活属性值，判断当前数据是否被选中,默认是未选中
          v.isAct = false;

          //v:当前项
          // console.log(v)
          // if(v.type == 'pay'){
          //   banner.pay.push(v)
          // }else{
          //   banner.pay.push(v)
          // }
          //简写
          banner[v.type].push(v);
        })
        // banner.pay[0].isAct = true;

        console.log(banner)

        //for in 遍历对象
        for(var k in banner){
          //k：键名
          // console.log(banner[k])
        
          //开始截取下标
          var beginIndex = 0;
          //条件循环语句 while(条件){代码块}  先判断条件是否成立，如果成立则执行代码块，执行完毕，再次判断条件，如果再次成立则执行代码块，反之终止循环
          while(beginIndex < banner[k].length){
              //分割数组 slice(开始截取下标，结束截取下标),截取的内容会以一个新数组返回
              //slice截取的内容不包括结束截取下标对应的数据
              var newArr = banner[k].slice(beginIndex,beginIndex+8);
              //重新更改开始截取下标
              beginIndex +=8;

              this.data.bannerIcon[k].push(newArr);
          }
        }

        //数据响应，更改视图层
        this.setData({
          bannerIcon:this.data.bannerIcon
        })
      },
      fall: err =>{
        console.log("获取图标数据失败=》",err)
      }
    })
  },
  //轮播图标点击事件
  bannerIconTop(e){
    // console.log(e)
    //获取当前点击的图标类型
    var type = e.currentTarget.dataset.type;
    //获取当前点击的图标在第几个滑块
    var index = e.currentTarget.dataset.index;
    //获取当前点击的图标在第几个对应的下标
    var id = e.currentTarget.dataset.id;
    // console.log(type,index,id)
    // console.log(this.data)
    
    //判断当前点击的图标是否是激活状态，如果是则取消它的激活状态，如果不是则设置它激活
    if(this.data.bannerIcon[type][index][id].isAct){
      //条件成立，则说明当前点击的图标是激活状态
      this.data.bannerIcon[type][index][id].isAct = false;

      this.data.actIcon.type = "";
      this.data.actIcon.index = "";
      this.data.actIcon.id = "";
    }else{
      //练习
      //点击取消上一个激活的图标
      // for(var i = 0;i < this.data.bannerIcon[type].length;i++){
      //   for(var k = 0;k < this.data.bannerIcon[type][i].length;k++){
      //     if(this.data.bannerIcon[type][i][k].isAct){
      //       this.data.bannerIcon[type][i][k].isAct = false;
      //       break;
      //     }
      //   }
      // }
      //第一种方法：遍历数据查找激活的数据，如果找到则取消激活
      // for(var k in this.data.bannerIcon){
      //   for(var i = 0; i < this.data.bannerIcon[k].length; i++){
      //     for(var j = 0; j < this.data.bannerIcon[k][i].length; j++){
      //       //判断当前遍历的图标是否有激活的
      //       if(this.data.bannerIcon[k][i][j].isAct){
      //         this.data.bannerIcon[k][i][j].isAct = false;
      //         break;
      //       }
      //     }
      //   }
      // }
      //第二种方法：记录激活的图标信息，根据信息取消对应的图标激活状态
      //判断是否有上一个激活的图标
      if(this.data.actIcon.type !=''){
        //条件成立则说明有上一个激活的图标
        this.data.bannerIcon[this.data.actIcon.type][this.data.actIcon.index][this.data.actIcon.id].isAct = false;
      }
      //设置当前点击的图标为激活状态
      this.data.bannerIcon[type][index][id].isAct = true;

      //记录当前激活的图标信息
      this.data.actIcon.type = type;
      this.data.actIcon.index = index;
      this.data.actIcon.id = id;
      // console.log("当前激活的图标信息==》",this.data.actIcon);
    }

    //数据响应
    this.setData({
      bannerIcon:this.data.bannerIcon
    })
  },
  //获取当天日期
  getToday(){
    //获取时间对象
    var time = new Date();
    //获取年份
    var y = time.getFullYear();
    //获取月份 注意：计算机月份从0开始，真实月份需加1
    var m = time.getMonth() + 1;
    //获取日
    var d = time.getDate();
    //数据响应
    this.setData({
      currentDate: y +"年" + this.addZero(m) + "月" + this.addZero(d) + "日",
      "info.date": y +"-" + this.addZero(m) + "-" + this.addZero(d),
      today:y +"-" + this.addZero(m) + "-" + this.addZero(d)
    })
  },
  //补零函数
  addZero(num){
    return num < 10 ? '0' + num :num
  },
  //获取用户填写的金额 日期 备注信息
  getInfo(e){
    console.log(e)
    //获取当前修改的数据类型
    var type = e.currentTarget.dataset.type;

    //如果当前修改的是日期数据，则需处理显示数据
    if(type == 'date'){
      // console.log(e.detail.value)
      //split()：字符串分割方法，参数：使用某个字符进行分割，返回分割后的数组
      var valArr = e.detail.value.split("-")
      // console.log(valArr)

      this.data.currentDate = valArr[0] + "年" + valArr[1] + "月" + valArr[2] + "日"
    }
    //设置用户修改的值
    this.data.info[type] = e.detail.value;
    //数据响应
    this.setData({
      info:this.data.info,
      currentDate:this.data.currentDate
    })
    // console.log(this.data.info)
  },
  //添加一条记账记录数据
  addMagData(){
    // console.log(1111)
    //存放记账记录数据
    var msgData = {};
    //获取标题数据
    for(var i = 0; i< this.data.costTitle.length; i++){
      if(this.data.costTitle[i].isAct){
        msgData.costName = this.data.costTitle[i].name;
        msgData.costType = this.data.costTitle[i].type;
        break;  //找到数据终止循环
      }
    }
    //获取激活的图标数据，判断用户是否有激活图标，如果没有则不添加数据到数据库上，反之则可以添加
    if(this.data.actIcon.type == ""){
        //条件成立则说明页面没有激活的图标，则不能保存数据
        //显示提示框提示用户选择图标
        wx.showToast({
          title: '请选择数据类型',
          icon:"loading",
          duration:2000,
          mask:true
        })
        return; //终止代码，不执行以下代码
    }else{
      var actType = this.data.actIcon.type;  //当前激活的图标类型
      var actIndex = this.data.actIcon.index;  //当前激活的图标对应滑块的下标
      var actId = this.data.actIcon.id;  //当前激活的图标对应的下标

      msgData.iconUrl = this.data.bannerIcon[actType][actIndex][actId].imgUrl;
      msgData.iconTitle = this.data.bannerIcon[actType][actIndex][actId].title;
    }
    //判断用户是否有填写金额，如果没有则默认值为0.00
    if(this.data.info.money == ""){
      this.data.info.money = "0.00"
    }

    //获取用户填写的金额
    for(var k in this.data.info){
      msgData[k] = this.data.info[k];
    }
    //显示正在保存提示框
    wx.showLoading({
      title:"正在保存...",
      mask:true
    })
    //调用云函数，保存数据
    wx.cloud.callFunction({
      name:"add_msg_data",
      data:msgData,
      success:res => {
        console.log("添加数据成功==》",res)
        //数据成功保存，页面数据恢复
        this.resetData();
        //数据保存成功，关闭提示框
        wx.hideLoading();
        //数据保存成功，跳转到首页
        wx.switchTab({
          url: '../home/home',
        })
      },
      fail:err => {
        console.log("添加数据失败==》",err)
      }
    })
    console.log("msgData==>",msgData)
  },
  //重置页面数据
  resetData(){
    //重置标题数据
    this.data.costTitle[0].isAct = true;
    this.data.costTitle[1].isAct = false;
    //取消激活的图标数据
    this.data.bannerIcon[this.data.actIcon.type][this.data.actIcon.index][this.data.actIcon.id].isAct = false;
    
    var timeArr = this.data.today.split("-");
    //数据响应
    this.setData({
      costTitle:this.data.costTitle,
      bannerIcon:this.data.bannerIcon,
      currentNum:0,
      info:{
        money:"",
        date:this.data.today,
        comment:""
      },
      currentDate:timeArr[0] + "年" + timeArr[1] + "月" + timeArr[2] + "日"
    })
  }
})