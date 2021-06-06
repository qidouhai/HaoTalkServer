'use strict';

const Service = require('egg').Service;

class MessageService extends Service{

    async storepersonmsg(data){
        const { app } = this
        const res = await app.mysql.insert('friendmsg',{
            id:null,
            sender:data.sender,
            receiver:data.receiver,
            msgtype:data.msgtype,
            context:data.context,
            contexttype:data.contexttype,
            sendtime:data.sendtime,
            status:1
        })
        return res.affectedRows === 1
    }

    async storegroupmsg(data){
        const { app } = this
        const res = await app.mysql.insert('groupmsg',{
            id:null,
            sender:data.sender,
            sendername:data.sendername,
            roomid:data.receiver,
            msgtype:data.msgtype,
            context:data.context,
            contexttype:data.contexttype,
            sendtime:data.sendtime,
            status:1
        })
        return res.affectedRows === 1
    }

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
        const res = await app.mysql.query(`select avatar,sender,sendername,roomid receiver,msgtype,context,contexttype,sendtime from groupmsg,userdata where roomid='${data.roomid}' and sendtime<'${data.time}' and 
                                            groupmsg.status=1 and sender=userid order by sendtime desc limit 10`)
        return res.map(item=>{
            return {...item,avatar:item.avatar.toString(),context:item.context.toString()}
        })
    }

    async sendmessage(data){
        const { app } = this
        const nsp = app.io.of('/')
        const roomId = await app.cache.get(data.receiver)
        console.log(data.sender+'发送消息  '+'类型',data.contexttype)
    
        try {
            if(data.receiver.startsWith('x')){
                await this.storegroupmsg(data)
            }else{
                await this.storepersonmsg(data)
            }
            nsp.to(roomId).emit('MESSAGE',data)
        } catch (error) {
            return error
        }
        return true
        //nsp.sockets[roomId].emit('MESSAGE',data)
        
     
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