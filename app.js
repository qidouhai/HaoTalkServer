
// app.js
class AppBootHook {
    constructor(app) {
      this.app = app;
    }
  
    async willReady() {
      // 所有的插件都已启动完毕，但是应用整体还未 ready
      // 可以做一些数据初始化等操作，这些操作成功才会启动应用
  
      // 例如：从数据库加载数据到内存缓存
      console.log('服务器启动')
      let rooms = await this.app.mysql.query(`select roomid from groupdata where status=1`)
      for(var item of rooms){
        await this.app.cache.set(item.roomid,item.roomid)
      }
    }
  
    async didReady() {
    }
  
    async serverDidReady() {
    }
  }
  
  module.exports = AppBootHook;