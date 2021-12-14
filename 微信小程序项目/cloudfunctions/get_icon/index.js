// 云函数入口文件
const cloud = require('wx-server-sdk')

//云函数初始化
cloud.init()

//获取数据库引用
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  //return：调用时返回的数据
  //await：等获取数据完毕之后再返回数据
  //collection("集合名称")：获取集合引用
  //get()：获取数据
  return await db.collection("icon").get()

}