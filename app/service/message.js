'use strict';

const Service = require('egg').Service;

class MessageService extends Service{
    async getpersonhistory(data){
        const { app } = this
        const res = await app.mysql.query(`select avatar,sender,receiver,msgtype,context,contexttype,sendtime from friendmsg,userdata where sender in('${data.uid}','${data.roomid}') and receiver in('${data.uid}','${data.roomid}') and
                                        sendtime<'${data.time}' and friendmsg.status=1 and sender=userid order by sendtime desc limit 10`)
        return res.map(item=>{
            return {...item,avatar:item.avatar.toString(),context:item.context.toString()}
        })
    }
     
    async getroomhistory(data){
        const { app } = this
        const res = await app.mysql.query(`select avatar,sender,sendername,roomid,msgtype,context,contexttype,sendtime from groupmsg,userdata where roomid='${data.roomid}' and sendtime<'${data.time}' and 
                                            groupmsg.status=1 and sender=userid order by sendtime desc limit 10`)
        return res
    }

    async sendmessage(data){
        const { app } = this
        const nsp = app.io.of('/')
        const roomId = await app.cache.get(data.receiver)
        //nsp.sockets[roomId].emit('MESSAGE',data)
        nsp.to(roomId).emit('MESSAGE',data)
        return true
    }

    async fetchHistory(data){
        var res
        if(!data.roomid.startsWith('x')){
            res = await this.getpersonhistory(data)
        }else{
            res = await this.getroomhistory(data)
            
        }
        return res
    }
}
module.exports = MessageService;