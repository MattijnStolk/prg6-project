//to start db on windows run "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
//or on linux "sudo systemctl start mongod"
const express = require('express')
const env = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const carRouter = require('./routes/carRouter.js')();

mongoose.connect('mongodb://localhost/car')

app = express()

console.log('starting up webservice')

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extendedparser: true, extended:true } ))

app.get('/', function (req, res) {
    res.header("Content-Type", "application/json")
    res.send('{"message": "hello world"}')
  })

app.use('/api', carRouter)

app.listen(8000)