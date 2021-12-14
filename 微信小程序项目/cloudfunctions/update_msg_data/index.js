// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数#异步操作
exports.main = async (event, context) => {
  //doc() 只操作对应id的这条数据
  return await db.collection('msg-data').doc(event.id).update({
    data:event.newData
  })
  
}