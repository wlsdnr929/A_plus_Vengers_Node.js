/*

    HTTP response status code (web server가 web browser에게 보내는 것) (서버 -> 클라이언트)

    sendStatus()

    postman

*/

const express = require('express')
const app = express()

app.get('/',(req,res)=>{
     res.sendStatus(200) // 200 : OK로 인식 -> 정상작동
    // res.sendStatus(400)    // 400 : Bad Request -> 문법 등이 틀렸음
    // 403 : forbidden (볼 권한이 없음)
    // 404 : not found
    // 500 : internal server error (서버 에러)
    // 503 : service unavailable (서버 사용 불가능)
})

app.listen(3000,()=>{
    console.log('포트 3000 듣기 시작')
})