// 这个中间件的作用是将接收到的数据再发送给客户端
'use strict';
module.exports = app => {
  return async next => {
    this.socket.emit('MESSAGE', 'packet received!');
    console.log('packet:', this.packet);
    await next();
  };
};
