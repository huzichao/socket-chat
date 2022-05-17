
const { json } = require("express")
const express = require('express')
const {createServer}  =  require('http')
const {Server}  = require('socket.io')


const app = express()
const httpServer = createServer(app)
app.use(require("express").static("public"));

const io  = new Server(httpServer,{
  // option
})


const STATE_LEAVE = 0; // 离开
const STATE_ENTER = 1; // 进入
const STATE_SPEAK = 2; // 发言


let count = 0
let username = ''
let headImage = ''
io.on('connection',(socket)=>{
  count++
  io.emit('count',count)
  socket.on('username',(data)=>{
    socket.username = data
    username = data
    io.emit('somebodyEnter',{
      username:socket.username,
      state:STATE_ENTER,
    })
  })
  // 获取用户的头像
  socket.on("sendHeadImg", (data)=>{
    socket.headImage = data;
    headImage = data
  })
  socket.on('speak',(data)=>{
    // 广播
      console.log(data);
      let obj = JSON.parse(data)

    io.emit("somebodySpeak", {
      username:obj.username,
      headImgUrl:obj.headImgUrl,
      msg: obj.msg,
      state: STATE_SPEAK,
      tm:socket.handshake.time
    });
  })
  // 断开连接
  socket.on('disconnect', function(){
    console.log(11111);
    io.emit('somebodyLeave',{
      username:socket.username,
      state:STATE_LEAVE,
    })
    count--;
    io.emit("count", count);
  });
  
})




let port = 9527

httpServer.listen(port, function(){
  console.log(`当前监听${port}端口`);
});
