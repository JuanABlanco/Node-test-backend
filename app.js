import express from 'express'
import fs  from 'fs'
import { createRequire } from "module";
import cors from 'cors';

const require = createRequire(import.meta.url);

const msgs = require('./msgs.json')

const app = express()

app.use(express.json())
app.use(cors()) 

function login(req, res){
    const user = {
        userName: 'interactiveschools',
        password: 'abcd1234'
    }

    if(req.body.name === user.userName && req.body.password === user.password){
        res.json({accessToken: 'ihaveloggedin'})
    }else{
        res.sendStatus(401)
    }
}

app.post('/api/login', login)

function postMessage (req, res){
    if(req.header('accessToken') !== 'ihaveloggedin' || !req.body.message) return res.sendStatus(403)

    const msgsArray = msgs.messages;

    const newMsg = {
        id: msgsArray.length,
        message: req.body.message,
        createdDate: Date.now()
    }
    
    msgs.messages.push(newMsg)

    fs.writeFile('./msgs.json', JSON.stringify(msgs), function writeJSON(err) {
        if (err) return res.sendStatus(500)
    });

    res.json(newMsg)
}

app.post('/api/message', postMessage)

function getMessage(req, res){
    if(req.header('accessToken') !== 'ihaveloggedin') return res.sendStatus(403)

    const messages = msgs.messages.sort(
        (a,b) => {
            return b.createdDate - a.createdDate;
        }
    )

    res.json(messages)
}

app.get('/api/message', getMessage)

function getMessageById(req,res){
    if(req.header('accessToken') !== 'ihaveloggedin') return res.sendStatus(403)

    const message = msgs.messages.find( 
        obj => {return obj.id === parseInt(req.params.id)}
    )
    
    if(!message) return res.sendStatus(400)
    
    res.json(message)
}

app.get('/api/message/:id', getMessageById)

export default app;