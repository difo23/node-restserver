require('./config/config');
const express = require('express');
const app = express();


const boddyParser = require('body-parser');

app.use(boddyParser.urlencoded({ extended: false}));
app.use(boddyParser.json());

app.get('/usuario', (req,res)=>{
    res.json('Get');
})

app.post('/usuario', (req,res)=>{

    let body = req.body;
    console.log(body.nombre);

    if (body.nombre === undefined){
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    }else{
        res.json({
            usuario: body
        });
    }
    // res.json({
    //          body
    //         });
})

app.put('/usuario', (req,res)=>{
    res.json('Put');
})

app.delete('/usuario', (req,res)=>{
    res.json('Delete');
})

app.listen(process.env.PORT, ()=>{
    console.log('Escuchando puerto',3000);
});