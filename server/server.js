require('./config/config');
const express = require('express');
const boddyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const PORT = process.env.PORT;

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname,'../public')));


app.use(boddyParser.urlencoded({ extended: false}));
app.use(boddyParser.json());

//configuracion goblar de rutas
app.use(require('./routes'));

mongoose.connect(process.env.URLDB,{ useNewUrlParser: true, useCreateIndex: true }, (err, res)=>{
    if(err) throw err;
    console.log("Mongo online");

})

app.listen(PORT, ()=>{
    console.log('Escuchando puerto',PORT);
});