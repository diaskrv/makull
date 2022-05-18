const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

mongoose.connect('mongodb://127.0.0.1:27017/userDataBase',{
    useNewUrlParser:true,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error',()=>console.log("Error to connection"))
db.once('open',()=>console.log("Connected to Database"))
