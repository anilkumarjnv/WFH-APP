import mysql from 'mysql2'

const connection = mysql.createPool({
    host:'127.0.0.1',
    user : 'root',
    password: 'Anil1531@',
    database:'social_media'
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
