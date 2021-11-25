//to start db run "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
//or on linux "sudo systemctl start mongod"
const express = require('express')
const env = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/notes')
app = express()

console.log('starting up webservice')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extendedparser: true, extended:true } ))

let notesRouter = require('../routes/notesRoutes.js')();

app.get('/', function (req, res) {
    res.header("Content-Type", "application/json")
    res.send('{"message": "hello world"}')
  })

app.use('/api', notesRouter)
app.listen(8000)