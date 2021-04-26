'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io, jwt } = app;
  //admin
  router.post('/login',controller.admin.login)
  router.post('/signup',controller.admin.signup)

  //历史消息
  router.get('/fetchHistory',controller.message.fetchHistory)
  //发送消息
  router.post('/sendmessage',controller.message.sendmessage)

  //获取消息列表
  router.post('/getmessage',jwt,controller.information.getmessage)
  //获取个人信息
  router.get('/getuserdata',controller.information.getuserdata)
  //编辑个人信息
  router.post('/editinfo',controller.information.editinfo)
  //获取好友列表
  router.get('/getfriends',controller.information.getfriends)
  //获取群组列表
  router.get('/getgroups',controller.information.getgroups)



  //socket接口
  io.of('/').route('exchange', io.controller.chat.exchange);
};
