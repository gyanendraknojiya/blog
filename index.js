//jshint esversion:6
require("dotenv").config();
const express = require('express')


const app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.render('index');
})


app.listen(process.env.Port || '3000',()=> {
    console.log('Server is runninng at port 3000')
    })