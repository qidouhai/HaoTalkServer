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

    let rooms = await app.mysql.query(`select roomid from groups where userid='${id}' and status=1`)
    rooms.forEach(item => {
      socket.join(item.roomid)
    });
    let lasttimeinfo = await app.mysql.query(`select lastonlinetime from users where userid='${id}' and status=1`)
    // 在线列表
    setTimeout(() => {
      console.log('在线列表', nsp.adapter.sids);
    }, 1000);
    let lasttime = lasttimeinfo[0].lastonlinetime
    //console.log(lasttime)
    let roomsid = rooms.reduce((pre,cur)=>{
      if(!pre.roomid) return "'"+cur.roomid+"'"
      else{
        return "'"+pre.roomid+"'"+","+"'"+cur.roomid+"'"
      }
    },'')
    //console.log("打印群组字符串",roomsid)
    if(lasttime){
      let personmsg = await app.mysql.query(`select avatar,sender,receiver,msgtype,context,contexttype,sendtime from friendmsg,userdata where (sender='${id}' or receiver='${id}') and
      sendtime>'${lasttime}' and friendmsg.status=1 and userid=sender order by sendtime `)
      let groupmsg = await app.mysql.query(`select avatar,sender,sendername,roomid receiver,msgtype,context,contexttype,sendtime from groupmsg,userdata where roomid in (${roomsid}) and sendtime>'${lasttime}' and 
      groupmsg.status=1 and sender=userid order by sendtime `)
      setTimeout(()=>{
        groupmsg.forEach(item=>{
          item.avatar=item.avatar.toString()
          item.context=item.context.toString()
          nsp.to(id).emit('MESSAGE',item)
        })
        personmsg.forEach(item=>{
          item.avatar=item.avatar.toString()
            item.context=item.context.toString()
          nsp.to(id).emit('MESSAGE',item)
        })
      },3000)
      
      console.log('打印个人未读消息',personmsg)
      console.log('打印群组未读消息',groupmsg)
    }
    await next();

    // 用户离开
    console.log(`用户${id}离开`);
    await app.mysql.query(`update users set lastonlinetime='${Date.now()}' where userid=${id}`)
    await app.cache.del(id)
    //await app.cache.has(id)

  };
};