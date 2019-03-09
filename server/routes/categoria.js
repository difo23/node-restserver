const express = require('express');
const bcrypt = require('bcrypt');
const _= require('underscore');
const {verificaToken, verificarAdminRole} = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');


const setresponse = require('../../util/setresponse');

const app = express();

app.get('/categoria',verificaToken, (req, res)=>{

    // envia todas las categorias en base de datos.

    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec(
        (err,categorias)=>{
            setresponse(err,categorias,res);
        }
    )


})

app.get('/categoria/:id',verificaToken, (req, res)=>{

    // solo envia categoria por usuario.
    let id = req.params.id;
        console.log(id);
    Categoria.findById(id, (err, categoriadb)=>{
        setresponse(err, categoriadb, res);
    })
  
})


app.post('/categoria', verificaToken, (req, res)=>{

    // crear nueva categoria.
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })
    categoria.save((err, categoriadb)=>{

        setresponse(err,categoriadb,res);

    })
    
})


app.put('/categoria/:id', verificaToken, (req, res)=>{

    // actualizar categoria.
    
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (err, categoriadb)=>{

        setresponse(err,categoriadb,res);
    }  )



    
})

app.delete('/categoria/:id',[verificaToken, verificarAdminRole], (req, res)=>{

    // borra categoria.
    //solo un administrador puede borrarla
    // 
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriadb)=>{
        
        setresponse(err,categoriadb,res);


    })

    
})


module.exports = app;