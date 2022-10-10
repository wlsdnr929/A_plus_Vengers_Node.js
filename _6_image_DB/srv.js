const { json } = require('express')
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

// Web Browser로부터 요청되는 이미지를 DB에서 추출한 후 제공하는 부분
app.post('/getimgfromdb',(req,res)=>{
    console.log('getimgfromdb 호출됨')

    pool.getConnection((err,conn)=>{
        const query_str = 'select * from animals where rid=7;'
        // fields : row의 각 항목
        conn.query(query_str,(error,rows,fields)=>{
            if(error){
                pool.releaseConnection(conn)
                console.dir(error)
                res.status(401).json('Query failed')
                return
            }

            const reply = {
                'result': rows
            }
            res.status(200).json(reply)
            pool.releaseConnection(conn)
        })
    })
})

app.listen(3000, ()=>{
    console.log('Server started at 3000')
})