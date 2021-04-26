// {app_root}/app/io/middleware/auth.js

const PREFIX = 'room';

module.exports = app => {
  return async (ctx, next) => {
    const { app, socket, logger, helper } = ctx;
    const id = socket.id;
    const nsp = app.io.of('/');
    await app.cache.set(id,id)
    
    const tick = (id, msg) => {
      console.log('#tick', id, msg);

      // 踢出用户前发送消息
      nsp.sockets[id].emit('MESSAGE',msg)
      // 调用 adapter 方法踢出用户，客户端触发 disconnect 事件
      nsp.adapter.remoteDisconnect(id, true, err => {
        logger.error(err);
      });
    };

    // 用户加入
    console.log('用户'+id+'上线');
    socket.join('sysroom');
    // 在线列表
    //console.log('在线列表', nsp.adapter.sids);
   

    await next();

    // 用户离开
    console.log(`用户${id}离开`);
    await app.cache.del(id)
    //await app.cache.has(id)

  };
};