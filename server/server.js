require('./config/config');
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const PORT = process.env.PORT;


const boddyParser = require('body-parser');

app.use(boddyParser.urlencoded({ extended: false}));
app.use(boddyParser.json());

app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, (err, res)=>{
    if(err) throw err;
    console.log("Mongo online");

})

app.listen(PORT, ()=>{
    console.log('Escuchando puerto',PORT);
});