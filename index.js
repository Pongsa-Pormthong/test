const bodyparser = require('body-parser') 
const express  = require('express')
const app = express()
const port = 8000
const mysql = require('mysql2/promise')
const cors = require('cors')
const path = require('path');


let conn = null

const initMysql = async ()=>{
     conn =  await mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'account'
    })
}

app.use(bodyparser.json())
app.use(cors())
app.use(express.json());

app.listen(port,async (req,res)=>{
    await initMysql()
    console.log(`Server running at http://localhost:${port}`);
})

app.get('/',async (req,res)=>{
    const result = await conn.query('SELECT * FROM user')
    res.json(result[0])
})
app.get('/display',async (req,res)=>{
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/insert_user', (req,res)=>{
    res.sendFile(path.join(__dirname, '/form.html'));
})

app.get('/user/:id',async (req,res)=>{
    let id = req.params.id
    const result = await conn.query('SELECT * FROM user Where id = ?',id)
    res.json(result[0])
})

app.put('/user/:id',async (req,res)=>{
    try{
        let id = req.params.id
        let Updateusername = req.body
        const result = await conn.query('UPDATE user SET ? WHERE id= ?',[Updateusername,id])
        res.json(result[0])
    }catch(e){
        res.status(500).json({
            message:"error ",
            error:e
        })
    }
})

app.delete('/user/:id', async(req,res)=>{
    try{
        let id = req.params.id
        const result = await conn.query('DELETE FROM  user WHERE id= ?',id)
        res.json({message:"delete complete",user:result})
    }catch(e){
        res.status(500).json({
            message:"error ",
            error:e
        })
    }
})

app.post('/user',async (req,res)=>{
    try{
        const user= req.body
        console.log(user)
        const result = await conn.query('INSERT INTO `user` (`title`, `Fname`, `Lname`, `BirthDate`, `Profile`, `update`) VALUES (?, ?, ?, ?, ?, ?)', [user.title, user.Fname, user.Lname, user.datetime, user.image, user.present]);
        //const result =  await conn.query('INSERT INTO user set ?',user)

        res.json({
            user_create:result[0],
            message:'insert user complete'
    })
    }catch(e){
        res.status(500).json({
            message:"error ",
            error:e
        })
    }
  
    
})