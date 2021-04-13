'use strict';
const  fs = require('fs')
const path = require('path')
const Controller = require('egg').Controller;

class MessageController extends Controller {
  async sendmessage() {
    const { ctx } = this;
    let file = ctx.request.files
    const { data } = ctx.request.body
    console.log(ctx)
    //console.log(data)
    /* file.forEach(item=>{
      let file = fs.readFileSync(item.filepath)
      fs.writeFileSync(path.join('./',`uploadfile/1.jpg`),file)
    } 
    // ctx.cleanupRequestFiles()*/
    ctx.resSuccess('发送成功');
  }

  async fetchHistory() {
    const { ctx } = this
    let file = ctx.request
    console.log(file)
    ctx.resSuccess('获取成功') 
  }

}

module.exports = MessageController;
