'use strict';

const Service = require('egg').Service;

class AdminService extends Service{
    async login(data){
        const { app } = this
        const res = await app.mysql.select('users',{
            where:{status:1,userid:data.userid},
        })
        //console.log(res)
        if(!res.length){
            return {
                status:false,
                msg:'账号不存在'
            }
        }else if(res[0].userid==data.userid && res[0].password==data.password){
            return {
            status:true,
            msg:'登陆成功'
            }
        }else{
            return{
                status:false,
                msg:'账号或密码错误'
            }
        }
    }

    async signup(data){
        const { app } = this
        const res = await app.mysql.select('users',{
            where:{userid:data.userid},
        })
        //console.log(res)
        if(res.length!==0){
            return false
        }else{
           const res1 = await app.mysql.insert('users',{
               userid:data.userid,
               password:data.password,
               status:1,
               createtime:Date.now()
            })
           const res2 = await app.mysql.insert('userdata',{
                userid:data.userid,
                username:data.username,
                status:1
           })
           //return res1.affectedRows === 1 && res2.affectedRows === 1
           return true
        }
    }

}

module.exports = AdminService;