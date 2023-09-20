import mysql from 'mysql2'

const connection = mysql.createPool({
    host:	'ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user : 'my3wn96q093tz71w',
    password: 'z67bbgc81dpbaxpf',
    database: 'bq3du3eharluds5p'
}).promise()

export async function readPosts(){
    const output = await connection.query("select * from posts")
    return output[0]
}

export async function readUser(profile) {
    const output = await connection.query("select * from users where profile='"+profile+"'")
    return output[0]
    
}
export async function insertUser(name,profile,password,headline){
    const output = await connection.query("insert into users(name,profile,password,headline) values('"+name+"','"+profile+"','"+password+"','"+headline+"')")
}
export async function insertPost(profile,content){
    const output = await connection.query("insert into posts(profile,content,likes,shares) values('"+profile+"','"+content+"',0,0)")
}
export async function likeFun(content){
    const output = await connection.query("select likes from posts where content=?",[content])
    const like = output[0][0].likes;
    const inclikes = like + 1
    await connection.query("update posts set likes= ? where content=?",[inclikes,content])

}
export async function shareFun(content){
    const output = await connection.query("select shares from posts where content=?",[content])
    const share = output[0][0].shares;
    const incshares = share+1
    await connection.query("update posts set shares=? where content=?",[incshares,content])
}
export async function deleteFun(content){
    const output = await connection.query("delete from posts where content=?",[content])
}
export async function myposts(profile){
    const output=await connection.query("select * from posts where profile='"+profile+"'")
    return output[0]
}
