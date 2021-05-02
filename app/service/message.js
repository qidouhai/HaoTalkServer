'use strict';

const Service = require('egg').Service;

class MessageService extends Service{
    async sendmessage(data){
        const { app } = this
        const nsp = app.io.of('/')
        const roomId = await app.cache.get(data.receiver)
        //nsp.sockets[roomId].emit('MESSAGE',data)
        nsp.to(roomId).emit('MESSAGE',data)
        return true
    }
}
module.exports = MessageService;