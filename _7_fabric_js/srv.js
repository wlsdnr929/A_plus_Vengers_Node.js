const express = require('express')
const mysql = require('mysql')
const path = require('path')
const static = require('serve-static')
const dbconfig = require('./config/dbconfig.json')

const pool = mysql.createPool({
    connectionLimit:10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false
})


const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/public',static(path.join(__dirname,'public')))

// main.html에서 '가져오기'버튼을 눌렀을 때, 답변하는 부분으로
// 이미지를 DB에서 가져와 보내줌
app.post('/getimgfromdbbyname',(req,res)=>{
    console.log('getimgfromdbbyname 호출됨')
    const imgname = req.body.imgname
    console.log(`imgname --> ${imgname}`)

    const reply = {
        'status':'nok'
    }
    pool.getConnection((err,conn)=>{
        // 에러발생
        if(err){
            pool.releaseConnection(conn)
            console.log('pool.getConnection 에러 발생')
            console.dir(err)
            reply['status'] = 'nok db pool error'
            res.json(reply)
            return
        }
        // 정상적으로 pool얻음
        const query_str = 'select `img` from animals where `name`=?'
        conn.query(query_str,[imgname],(error,rows,fields)=>{
            // query 에러발생
            if(error){
                pool.releaseConnection(conn)
                console.dir(error)
                reply['status'] = 'nok query error'
                res.json(reply)
                return
            }
            // 정상적으로 image 받아옴
            pool.releaseConnection(conn)
            if(rows.length > 0){
                reply['status'] = 'ok'
                reply['rows'] = rows
                console.log('이미지 전달 성공')
            }
            // 가져와보니 아무것도 없을 때(DB에 없는 데이터 요청)
            else{
                reply['status'] = 'Nok, no result'
                console.log('사진 이름과 매칭되는 사진 없음')
            }
            res.json(reply)
        })
    })
})

app.post('/saveBbox',(req,res)=>{
    console.log('saveBbox 호출됨')
    const imgname = req.body.imgname
    const coordstxt = req.body.coords
    console.log(`imgname is ${imgname}`)
    console.log(`coords is ${coordstxt}`)

    const reply = {
        'status':'nok'
    }

    pool.getConnection((err,conn)=>{
        // pool 에러발생
        if(err){
            pool.releaseConnection(conn)
            console.log('pool.getConnection 에러 발생')
            console.dir(err)
            reply['status'] = 'nok db pool error'
            res.json(reply)
            return
        }
        // 정상적으로 pool 얻음
        const query_str = 'update animals set`coord`=? where `name`=?'
        conn.query(query_str,[coordstxt,imgname],(error,rows,fields)=>{
            // query 에러발생
            if(error){
                pool.releaseConnection(conn)
                console.dir(error)
                reply['status'] = 'nok query error'
                res.json(reply)
                return
            }
            // query 성공
            pool.releaseConnection(conn)
            reply['status'] = 'ok'
            res.json(reply)
            console.log(`Coords 저장성공, 대상 이미지 ${imgname} `)
        })
    })

})

app.listen(3000, ()=>{
    console.log('Server started at 3000')
})