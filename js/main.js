const express = require('express')
const env = require('dotenv')

app = express()

app.get('/', function (req, res) {
    res.send('hello world')
  })

console.log('starting up')

app.listen(8080)