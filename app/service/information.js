'use strict';

const Service = require('egg').Service;

class InfoService extends Service{
    async editinfo(data){
        const { app } = this
        const res = await app.mysql.insert('userdata',{
            where:{userid:data.userid},
        })
    }
    async getuserdata(uid){
        const { app } = this
        const res= await app.mysql.select('userdata',{
            where:{userid:uid,status:1}
        })
        if(res){
            return res
        }else{
            return false
        }
    }

    async getmessage(data){
        const { app } = this
        let result=[]
        for(const item of data.idList){
            if(item.startsWith('x'))
            {

            }
            else
            {
                let info= await app.mysql.query(`select avatar,username,littlename from userdata,friends where userdata.userid=friends.userid and userdata.userid=${item}`)
                const message = await app.mysql.select('message',{
                    where:{sender:[data.uid,item],status:1,receiver:[data.uid,item]},
                    limit:10,
                    orders:[['sendtime','desc']]
                })
                message.forEach(item => {
                    item.avatar=info[0].avatar
                    item.context = item.context.toString()
                });
                console.log(message)
                result.push({
                    uid:item,
                    avatar:info[0].avatar,
                    littlename:info[0].littlename,
                    name:info[0].username,
                    list:message,
                })
            }
            
        }
        //console.log(result)
        return result
        
    }

    async getfriends(uid){
        const { app } = this
        const res = await app.mysql.query(`select friendid,littlename,avatar from userdata,friends where userdata.userid=friends.userid and friends.userid=${uid}`)
        console.log(res)
        return res
    }
}


module.exports = InfoService;