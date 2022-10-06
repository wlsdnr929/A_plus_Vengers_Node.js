
// server

const express = require('express') 
// const { request } = require('http')
const mysql = require('mysql2')  // npm install mysql2 --save
const path = require('path')
const static = require('serve-static') // 현재(srv.js)를 루트 디렉토리(가장 위쪽)로 사용
const dbconfig = require('./config/dbconfig.json')

// Database connection pool
// pool :  connection들이 여러 개 있는 것 (mysql 과 node.js 사이의)
const pool = mysql.createPool({
    // host,user,password는 config/dbconfig.json 파일에 따로 저장
    connectionLimit: 10,  // pool에 들어있는 최대 connection
    host: dbconfig.host,  // database의 ip주소
    //port: dbconfig.port,
    user: dbconfig.user,
    password : dbconfig.password,
    database : dbconfig.database,
    waitForConnections:true,
    debug: false
})

// Web Server
const app = express()
// 환경설정 해주기 (전송에 유리하게)
// 웹 브라우저로부터 request 온 것을 정보수집에 유리하게 해줌 (각각 나눠서)
// ---> 아래 2줄
app.use(express.urlencoded({extended:true}))
app.use(express.json())
// public 경로에 대한 요청들어오면 -> 현재 directory의 public으로
// path.join : 현재 directory에 뒤의 것('public')을 '/public'이라고 하겠다
// static : 루트(가장 위쪽의) directory로 사용
app.use('/public', static(path.join(__dirname, 'public')))

// 회원가입
// post 방식으로 '/process/adduser'에 들어오면 처리
// req : web -> server,  res : server ->  web
app.post('/process/adduser',(req,res)=>{
    console.log('/process/adduser 호출됨 ' + req)

    const paramId = req.body.id;
    const paramName = req.body.name;
    const paramAge = req.body.age;
    const paramPassword = req.body.password;

    // 웹브라우저가 보낸 request를 분류해서 DB에 저장 
    // pool에서 놀고 있는 connection 하나 가져오기
    pool.getConnection((err,conn)=>{
        // err: 연결 안 됨, conn: 연결 성공
        if(err){
            pool.releaseConnection(conn);
            console.log('Mysql getConnection error. aborted');
            res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
            res.write('<h1>DB 서버연결 실패</h1>')
            res.end();
            return;
        }

        console.log('데이터베이스 연결 끈 얻었음...ㅎㅎ');

        // DB에 request(query) 보냄
        const exec = conn.query('insert into users (id, name, age, password) values (?,?,?,password(?));',
                    [paramId,paramName,paramAge,paramPassword], // '?'에 들어갈 것들
                    // callback 함수
                    (err, result)=>{
                        // 다음 사람을 위해 conn 다시 풀어줌
                        pool.releaseConnection(conn);
                        console.log('실행된 SQL: ' +exec.sql)

                        if(err){
                            console.log('SQL 실행시 오류 발생')
                            console.dir(err);
                            res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                            res.write('<h1>SQL query 실행 실패</h1>')
                            res.end();
                            return
                        }

                        if(result){
                            console.dir(result)
                            console.log('Inserted 성공')
                            res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                            res.write('<h2>사용자 추가 성공</h2>')
                            res.end();
                        }
                        else{
                            console.log('Inserted 실패')

                            res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                            res.write('<h1>사용자 추가 실패</h1>')
                            res.end();
                        }
                    }
        )

    })
})

// 로그인
// post 방식으로 '/process/adduser'에 들어오면 처리
app.post('/process/login',(req,res)=>{
    console.log('/process/login 호출됨 ' + req)

    const paramId = req.body.id;
    const paramPassword = req.body.password;
    
    console.log('로그인 요청 ' + paramId + ' ' + paramPassword)

    // 웹브라우저가 보낸 request를 분류해서 DB에 저장 
    // pool에서 놀고 있는 connection 하나 가져오기
    pool.getConnection((err,conn)=>{
        // err: 연결 안 됨, conn: 연결 성공
        if(err){
            pool.releaseConnection(conn);
            console.log('Mysql getConnection error. aborted');
            res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
            res.write('<h1>DB 서버연결 실패</h1>')
            res.end();
            return;
        }

        console.log('데이터베이스 연결 끈 얻었음...ㅎㅎ');

       const exec = conn.query('select `id`, `name` from `users` where `id`= ? and `password` = password(?);',
                [paramId,paramPassword], // '?'에 들어갈 것들
                (err,rows)=>{
                    pool.releaseConnection(conn)
                    console.log('실행된 SQL query: ' + exec.sql)
                    if(err){
                        console.log('SQL 실행시 오류 발생')
                        console.dir(err);
                        res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                        res.write('<h1>SQL query 실행 실패</h1>')
                        res.end();
                        return
                    }

                    if(rows.length > 0){
                        // 매칭되는 id,password 있으면
                        console.log('아이디 [%s], 패스워드가 일치하는 사용자 [%s] 찾음',paramId, rows[0].name)
                        console.log('Select 성공')
                        res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                        res.write('<h2>로그인 성공</h2>')
                        res.end();
                        return;
                    }
                    else{
                        console.log('아이디 [%s], 패스워드가 일치하는 사용자 없음',paramId)
                        console.log('Select 실패')
                        res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                        res.write('<h2>로그인 실패, 아이디와 패스워드를 확인하세요.</h2>')
                        res.end();
                        return;
                    }
                }

       )

    })
})

app.listen(3000,()=>{
    console.log('Listening on port 3000');
})