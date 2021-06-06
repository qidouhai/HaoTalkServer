'use strict';

const Controller = require('egg').Controller;

class InfoController extends Controller{
    async editinfo(){
        const { ctx } = this
        try{
            const { data } = ctx.request.body
            const res=await ctx.service.information.editinfo(data)
            res && ctx.resSuccess(res,'修改成功')
        }catch(err){
            ctx.resFail(err.message)
        }
    }

    async editgroup(){
        const { ctx } = this
        try{
            const { data } = ctx.request.body
            const res=await ctx.service.information.editgroup(data)
            res && ctx.resSuccess(res,'修改成功')
        }catch(err){
            ctx.resFail(err.message)
        }
    }

    async getmessage(){
        const { ctx } = this;
        try{
            const { data } = ctx.request.body
            const res = await ctx.service.information.getmessage(data)
            res && ctx.resSuccess(res,'获取成功')
            //console.log(res)
        }catch(err){
            ctx.resFail(err.message)
        }
    }

    async getuserdata(){
        const { ctx } = this;
        try{
            const uid = ctx.request.url.split('=')[1]
            const res= await ctx.service.information.getuserdata(uid)
            //console.log(res)
            res && ctx.resSuccess(res,'获取成功')
        }catch(err){
            ctx.resFail(err.message)
        }
    }

    async getgroupdata(){
        const { ctx } = this;
        try{
            const uid = ctx.request.url.split('=')[1]
            const res= await ctx.service.information.getgroupdata(uid)
            //console.log(res)
            res && ctx.resSuccess(res,'获取成功')
        }catch(err){
            ctx.resFail(err.message)
        }
    }

    async getfriends(){
        const { ctx } = this;
        try{
            const uid = ctx.request.url.split('=')[1]
            const res = await ctx.service.information.getfriends(uid)
            res && ctx.resSuccess(res,'获取成功')
        }catch(err){
            ctx.resFail(err.message)
        }
    }

    async getgroups(){
        const { ctx } = this
        try{
            const uid = ctx.request.url.split('=')[1]
            const res = await ctx.service.information.getgroups(uid)
            res && ctx.resSuccess(res,'获取成功')
        }catch(err){
            ctx.resFail(err.message)
        }
    }
}

module.exports = InfoController;