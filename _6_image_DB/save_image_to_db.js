
/*
     DB에 이미지 넣는 기능 구현
*/

const mysql = require('mysql')
// 로컬 파일에 있는 것들을 저장하기 위함
const fs = require('fs')
const dbconfig = require('./config/dbconfig.json')
const { userInfo } = require('os')
const { off } = require('process')

// 사진을 올리기만 하면 되므로 pool 말고 
// connection 1개만 있어도 됨
const connection = mysql.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false
})

// 로컬에서 이미지를 읽어서, DB에 저장
// readFileSync : 동기 -> 파일을 다 읽을 때까지 기다림
// readFile :     비동기 -> 기다리지 않고 다른 일 함
const tiger = {
    img: fs.readFileSync('./img_tiger.jpg'),
    name: 'Tiger' 
}

// insert into ~ set : 'tiger' 객체를 알아서 DB의 img와 name으로 풀어서 저장
const query = connection.query('insert into `animals` set ?', tiger,
    (err,result)=>{
        if(err){
            console.log(err)
            return
        }
        console.log('이미지를 DB에 추가 성공: ')
        // console.log(query.sql)
        console.dir(result)
    }
)

const lion = {
    img: fs.readFileSync('./img_lion.jpg'),
    name: 'Lion'
}

const query1 = connection.query('insert into `animals` set ?', lion,
    (err,result)=>{
        if(err){
            console.log(err)
            return
        }
        console.log('이미지를 DB에 추가 성공: ')
        // console.log(query.sql)
        console.dir(result)
    }
)

connection.end()