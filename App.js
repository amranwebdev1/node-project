const express = require("express")
const userRouter = require("./routes/user.router.js")
const postRouter = require("./routes/post.router.js")
const commentRouter = require("./routes/comment.router.js")
require('./config/db.js')
const cors = require('cors')
const app = express()
app.use(cors())
app.use('/upload', express.static('upload'));

app.use(express.json())
app.use(express.urlencoded({extended:true}))
//userRouter
app.use('/api/user',userRouter);
//postRouter
app.use('/api/post',postRouter);
//comment router
app.use('/api/post/comment',commentRouter);
//testing
app.get("/",(req,res)=>{
  res.send("<h1>Hi Amran this is testing</h1>")
})


app.use((req,res,next)=>{
  console.log("Error 404")
})
app.use((err,req,res,next)=>{
  console.log("server error",err)
})
module.exports = app