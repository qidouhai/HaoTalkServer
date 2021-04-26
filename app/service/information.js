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
                phone:data.phone||null,
                address:data.address||null,
                birthday:data.birthday||null,
                motto:data.motto||null,
                introduction:data.introduction||null,
                status:1
            })
            return { success: true };
        },ctx)
        return res
    }
    async getuserdata(uid){
        const { app } = this
        const res= await app.mysql.select('userdata',{
            where:{userid:uid,status:1}
        })
        if(res[0].avatar){
            res[0].avatar=res[0].avatar.toString()
            return res
        }else{
            return res
        }
    }

    async getmessage(data){
        const { app } = this
        let result=[]
        var mainavatar = await app.mysql.select('userdata',{
            where :{status:1,userid:data.uid},
            columns:['avatar']
        })
        console.log(data.idList)
        for(let item of data.idList){
            if(item.startsWith('x'))
            {
                const message = await app.mysql.select('groupmsg',{
                    where:{roomid:item,status:1},
                    limit:10,
                    orders:[['sendtime','esc']]
                    })
                console.log(1)
            }
            else
            {
                let info= await app.mysql.query(`select avatar,username,littlename from userdata,friends where userdata.userid=friends.userid and userdata.userid=${item} and userdata.status=1`)
                const message = await app.mysql.select('friendmsg',{
                    where:{sender:[data.uid,item],status:1,receiver:[data.uid,item]},
                    limit:10,
                    orders:[['sendtime','esc']]
                })
                if(!message.length){
                    continue
                }
                //console.log('打印消息列表', message)
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
        
        return result
        
    }

    async getfriends(uid){
        const { app } = this
        const res = await app.mysql.query(`select friendid,littlename,username,avatar from userdata,friends where userdata.userid=friends.friendid and friends.userid=${uid} and friends.status=1 and userdata.status=1`)
        //console.log('打印盆友列表', res)
        res.forEach(item => {
            item.avatar = item.avatar.toString()
        });
        return res
    }

    async getgroups(uid){
        const { app } = this
        const result=[]
        const roomids = await app.mysql.query(`select roomid from groups where userid=${uid} and status=1`)
        for(let item of roomids){
            const res = await app.mysql.query(`select roomid,avatar,creater,roomname from groupdata where groupdata.roomid='${item.roomid}' and groupdata.status=1`)
            res[0].avatar = res[0].avatar?res[0].avatar.toString():null
            result.push(res[0])
        }
        return result
    }
}


module.exports = InfoService;