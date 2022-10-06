
const express = require('express')  // npm install express --save
const app = express()

// pages 경로로 들어오는 요청에 대해서는
// 로컬 폴더 __dirname : main.js가 있는 폴더 위치
// __dirname + '/pages'
app.use('/pages',express.static(__dirname + '/pages'))

// listen : 귀를 대고 듣고있음 (대기)
// callback : 듣고 난 후 행동
app.listen(3000,()=>{
    console.log('3000번 port에 귀를 대고 듣기 시작했다.')
})

// 처리해주는 루틴들을 추가...

// client가 server로 http명령어 중 get(가장 기본적인)을 보낼 때 처리해주는 부분
app.get('/',(req,res)=>{
    // req :  web browser에서 server로 (request)
    // res :  web server에서 web browser로 (response)
    console.log('---> 루트(\)에 대한 요청 들어왔음')
    // res.send('루트에 대한 요청')
    res.sendFile(__dirname + '/pages/index.html')
}) 

app.get('/about',(req,res)=>{
    console.log('---> about에 대한 요청 들어왔음')
    // res.send('about에 대한 요청')
    res.sendFile(__dirname + '/pages/about.html')
})

app.get('/working',(req,res)=>{
    console.log('---> working에 대한 요청 들어왔음')
    // res.send('about에 대한 요청')
    res.sendFile(__dirname + '/pages/working.html')
})


