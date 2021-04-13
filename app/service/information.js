'use strict';

const Service = require('egg').Service;

class InfoService extends Service{
    async editinfo(data){
        const { app, ctx } = this
        const res = await app.mysql.beginTransactionScope(async conn=>{
            await conn.query(`update userdata set status=0 where userid=${data.userid}`)
            await conn.insert('userdata',{
                id:null,
                userid:data.userid,
                username:data.username,
                avatar:data.avatar,
                phone:data.phone||null,address:data.address||null,
                birthday:data.birthday||null,
                motto:data.motto||null,
                introduction:data.introduction||null,
                status:1
            })
            /* await conn.query(`insert into userdata (id,userid,username,avatar,phone,address,birthday,motto,introduction,status) 
            values (null,${data.userid},${data.username},${'data.avatar'},${data.phone||null},${data.address||null},${data.birthday||null},${'data.motto'||null},${data.introduction||null},1)`) */
            return { success: true };
        },ctx)
        return res
    }
    async getuserdata(uid){
        const { app } = this
        const res= await app.mysql.select('userdata',{
            where:{userid:uid,status:1}
        })
        if(res){
            res[0].avatar=res[0].avatar.toString()
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
                let mainavatar = await app.mysql.select('userdata',{
                    where :{status:1,userid:data.uid},
                    columns:['avatar']
                })
                const message = await app.mysql.select('message',{
                    where:{sender:[data.uid,item],status:1,receiver:[data.uid,item]},
                    limit:10,
                    orders:[['sendtime','desc']]
                })
                message.forEach(item => {
                    item.avatar=item.sender==data.uid?mainavatar[0].avatar.toString():info[0].avatar.toString()
                    item.context = item.context.toString()
                });
                result.push({
                    uid:item,
                    avatar:info[0].avatar.toString(),
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
        const res = await app.mysql.query(`select friendid,littlename,username,avatar from userdata,friends where userdata.userid=friends.friendid and friends.userid=${uid} and friends.status=1 and userdata.status=1`)
        //console.log(res)
        return res
    }
}


module.exports = InfoService;