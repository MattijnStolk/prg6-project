const express = require('express')
const env = require('dotenv')
const mongoose = require('mongoose')

console.log('starting up webservice')

app = express()

app.get('/', function (req, res) {
    res.header("Content-Type", "application/json")
    res.send('{"message": "hello world"}')
  })

app.listen(8000)