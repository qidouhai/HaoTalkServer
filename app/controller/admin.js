'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller{
    async login() {
        const { ctx, app } = this
        try{
            const { data } = ctx.request.body
            const res=await ctx.service.admin.login(data)
            if(res.status){
                const token = app.jwt.sign({
                    userid: data.userid,
                    password: data.password,
                }, app.config.jwt.secret,{
                    //expiresIn: '30s',
                });
                ctx.resSuccess(token,res.msg)
            }else{
                ctx.resFail(res.msg)
            }
            
             //ctx.body.token = token  
        }catch(err){
            ctx.resFail(err.message)
        }
    }
    async signup(){
        const { ctx } = this
        try{
            //console.log(ctx.request.body)
            const { data } = ctx.request.body
            const res=await ctx.service.admin.signup(data)
            res ? ctx.resSuccess(res,'注册成功'):ctx.resSuccess(res,'账号已存在')
        }catch(err){
            ctx.resFail(err.message)
        }
    }
}

module.exports = AdminController;