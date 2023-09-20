import express from 'express'
import hbs from 'hbs'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import {readPosts,readUser,insertUser,insertPost,likeFun,shareFun,deleteFun,myposts} from './operations.js'

const app = express()

app.set('view engine','hbs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.render("login")
})

app.post('/login',async (req,res)=>{
    const output = await readUser(req.body.profile)
    const password = output[0].password
    if(password===req.body.password)
    {
        const secret = '05519b158f36c2671da82719fbeab9fea6284345a61434c1e11828a0bf861d6cb192f36c91b97b953b84112b4f8c32df056c3591278dbbc289975abb33e26594'
        const payload = {"profile":output[0].profile,"name":output[0].name,"headline":output[0].headline}
        const token = jwt.sign(payload,secret)
        res.cookie("token", token)
        res.redirect("/posts")
    }
    else
    {
        res.send("Incorrect Username or Password")
    }
})

app.get('/posts',verifyLogin, async(req,res)=>{
    const output = await readPosts()

    res.render("posts",{
        data:output,
        userInfo:req.payload
    })
})

app.post('/like', async(req,res)=>{
    await likeFun(req.body.content)
    res.redirect('/posts')
})
app.post('/share',async(req,res)=>{
    await shareFun(req.body.content)
    res.redirect('/posts')
})

app.post('/addposts',async(req,res)=>{
    await insertPost(req.body.profile,req.body.content)
    res.redirect('/posts')
})
app.post('/deletepost',async(req,res)=>{
    await deleteFun(req.body.content)
    res.redirect('/posts')
})
app.post('/myposts',async(req,res)=>{
    const output = await myposts(req.body.profile)

    res.render("myposts",{
        data:output,
        userInfo:req.payload
    })
})

function verifyLogin(req,res,next){
    const secret = '05519b158f36c2671da82719fbeab9fea6284345a61434c1e11828a0bf861d6cb192f36c91b97b953b84112b4f8c32df056c3591278dbbc289975abb33e26594'
    const token = req.cookies.token
    jwt.verify(token,secret,(err,payload)=>{
        if(err) return res.sendStatus(403)
        req.payload = payload
    })
    next()
}
app.post('/addusers',async(req,res)=>{
    if(req.body.password === req.body.cnfpassword){
        await insertUser(req.body.name, req.body.profile, req.body.password,req.body.headline)
        res.redirect('/')
    }
    else{
        res.send("password and confirm password did not match")
    }
})
app.get('/register',(req,res)=>{
    res.render("register")
})

app.listen(process.env.PORT ||3000,()=>{
    console.log("listening...")
})