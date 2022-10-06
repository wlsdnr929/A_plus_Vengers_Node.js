const express = require('express')  // 웹브라우저
const mysql = require('mysql') // DB (MYSQL)
const path = require('path')
const static = require('serve-static')
const { PassThrough } = require('stream')
const dbconfig = require('./config/dbconfig.json')

// database connection pool

const pool = mysql.createPool({
    connectionLimit:10,
    host:dbconfig.host,
    user:dbconfig.user,
    password:dbconfig.password,
    database:dbconfig.database,
    debug:false,
    // timezone 설정
    // - DB에 입력된 시간은 UTC이므로 한국시간으로 변경해야함
    // - UTC에서 9시간이 빠름
    timezone: '09:00'
})

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/public',static(path.join(__dirname,'public')))

// main.html
// web에서 'post'방식으로 들어오는 명령을 수행
app.post('/chartdatafromdb',(req,res)=>{
    console.log('chartdatafromdb 호출됨')
    
    // connection 뚫기
    pool.getConnection((err,conn)=>{
        const resData = {}
        resData.result = 'error'  // 초기값: error, 데이터 들어오면 ok로 바뀜
        resData.temp = []
        resData.reg_date = []

        // 에러
        if(err){
            pool.releaseConnection(conn)
            console.log('Mysql getConnection error. aborted')
            // resData를 json 형식으로 바꿔서 보냄
            res.json(resData)
            return
        }

        // 정상작동

        // DB에 데이터를 요청
        const exec =  conn.query(
            'select `temperature`,`reg_date` from `building_temperature` order by `reg_date` asc;',
            (err,rows)=>{
                //에러
                if(err){
                    console.log('Mysql query error. aborted')
                    res.json(resData)
                    return
                }

                // 결과(데이터)가 있다면
                if(rows[0]){
                    resData.result = 'ok'
                    rows.forEach((val) => {
                        // 받아온 데이터에서 온도와 날짜 각각 push
                        resData.temp.push(val.temperature)
                        resData.reg_date.push(val.reg_date)
                    });
                }
                else{
                    // query는 성공, 그러나 데이터가 없는 경우
                    resData.result = 'none'
                }

                // 여기까지 오면
                // 보낼 데이터 준비완료
                // 데이터를 쏘면 됨
                return res.json(resData)

            })

    })
})

// main2.html
// building id 주어졌을 때
// web에서 'post'방식으로 들어오는 명령을 수행
app.post('/chartdatafromdbwithbid',(req,res)=>{
    console.log('chartdatafromdbwithbid 호출됨')
    
    const bid = req.body.bid

    console.log('bid is %s', bid)

    // connection 뚫기
    pool.getConnection((err,conn)=>{
        const resData = {}
        resData.result = 'error'  // 초기값: error, 데이터 들어오면 ok로 바뀜
        resData.temp = []
        resData.reg_date = []

        // 에러
        if(err){
            pool.releaseConnection(conn)
            console.log('Mysql getConnection error. aborted')
            // resData를 json 형식으로 바꿔서 보냄
            res.json(resData)
            return
        }

        // 정상작동

        // DB에 데이터를 요청
        // query할 때 building id 사용
        const exec =  conn.query(
            'select `temperature`,`reg_date` from `building_temperature` where `building_id`=? order by `reg_date` asc;',
            [bid],
            (err,rows)=>{
                //에러
                if(err){
                    console.log('Mysql query error. aborted')
                    res.json(resData)
                    return
                }

                // 결과(데이터)가 있다면
                if(rows[0]){
                    resData.result = 'ok'
                    rows.forEach((val) => {
                        // 받아온 데이터에서 온도와 날짜 각각 push
                        resData.temp.push(val.temperature)
                        resData.reg_date.push(val.reg_date)
                    });
                }
                else{
                    // query는 성공, 그러나 데이터가 없는 경우
                    resData.result = 'none'
                }

                // 여기까지 오면
                // 보낼 데이터 준비완료
                // 데이터를 쏘면 됨
                return res.json(resData)

            })

    })
})

app.listen(3000,()=>{
    console.log('Server started at 3000')
})