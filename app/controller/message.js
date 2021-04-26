'use strict';
const  fs = require('fs')
const path = require('path')
const Controller = require('egg').Controller;

class MessageController extends Controller {
  async sendmessage() {
    const { ctx, app } = this;
    let file = ctx.request.files
    /* file.forEach(item=>{
      let file = fs.readFileSync(item.filepath)
      fs.writeFileSync(path.join('./',`uploadfile/1.jpg`),file)
    } 
    // ctx.cleanupRequestFiles()*/
    try{
      const { data } = ctx.request.body
      const res=await ctx.service.message.sendmessage(data)
      res && ctx.resSuccess(res,'修改成功')
    }catch(err){
      ctx.resFail(err.message)
    }
  }

  async fetchHistory() {
    const { ctx } = this
    let file = ctx.request
    console.log(file)
    ctx.resSuccess('获取成功') 
  }

}

module.exports = MessageController;
