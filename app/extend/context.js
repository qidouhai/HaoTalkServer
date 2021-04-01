module.exports = {

    // this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
  
    resSuccess(respData = {}, respMsg = '', respCode = '0') {
      this.body = {
        respData,
        respMsg,
        respCode: Number(respCode),
      }
    },
  
    resFail(respMsg = '', respData = {}, respCode = '-1') {
      this.body = {
        respData,
        respMsg,
        respCode: Number(respCode),
      }
    }
}
  