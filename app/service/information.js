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

    async editgroup(data){
        const { app, ctx } = this
        const res = await app.mysql.beginTransactionScope(async conn=>{
            await conn.query(`update groupdata set status=0 where roomid='${data.roomid}'`)
            await conn.insert('groupdata',{
                id:null,
                creater:data.creater,
                roomname:data.roomname,
                avatar:data.avatar,
                poster:data.poster||null,
                roomid:data.roomid,
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
            res[0].backavatar=res[0].backavatar.toString()
            return res
        }else{
            return res
        }
    }

    async getgroupdata(uid){
        const { app, ctx } = this
        const res = await app.mysql.beginTransactionScope(async conn=>{
            let baseinfo = await conn.select('groupdata',{
                where:{roomid:uid,status:1}
            })
            let members = await conn.query(`select avatar,userid,username from userdata where userid in (select userid from groups where groups.roomid='${uid}' and groups.status=1)`)
            members.forEach(item => {
                item.avatar = item.avatar && item.avatar.toString()
            });
            baseinfo[0].groupmember = members
            return {...baseinfo[0],avatar:baseinfo[0].avatar&&baseinfo[0].avatar.toString()}
        },ctx)
        return res
    }

    async getmessage(data){
        if(!data.idList) return []
        const { app } = this
        let lasttimeinfo = await app.mysql.query(`select lastonlinetime from users where userid='${data.uid}' and status=1`)
        let lasttime = lasttimeinfo[0].lastonlinetime
        let result=[]
        var mainavatar = await app.mysql.select('userdata',{
            where :{status:1,userid:data.uid},
            columns:['avatar']
        })
        for(let item of data.idList){
            if(item.startsWith('x'))
            {
                const roominfo = await app.mysql.query(`select avatar,roomname,creater from groupdata where roomid='${item}' and status = 1`)
                const message = await app.mysql.query(`select avatar,sender,sendername,roomid receiver,msgtype,context,contexttype,sendtime from groupmsg,userdata where userid=sender and roomid='${item}' 
                and sendtime<'${lasttime}' and groupmsg.status=1 and userdata.status=1 order by sendtime `)
                if(!message.length) continue
                message.forEach(item => {
                    item.avatar = item.avatar.toString()
                    item.context = item.context.toString()
                });
                result.push({
                    uid:item,
                    avatar:roominfo[0].avatar?roominfo[0].avatar.toString():null,
                    name:roominfo[0].roomname,
                    list:message,
                    creater:roominfo[0].creater
                })
            }
            else
            {
                let info= await app.mysql.query(`select avatar,username,littlename from userdata,friends where userdata.userid=friends.userid and userdata.userid=${item} and userdata.status=1`)
                const message = await app.mysql.query(`select * from friendmsg where sender in('${data.uid}','${item}') and receiver in('${data.uid}','${item}')
                and status=1 and sendtime<'${lasttime}' order by sendtime`)
                /* const message = await app.mysql.query('friendmsg',{
                    where:{sender:[data.uid,item],status:1,receiver:[data.uid,item]},
                    limit:10,
                    orders:[['sendtime','esc']]
                }) */
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