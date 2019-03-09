const express = require('express');
const {verificaToken} = require('../middlewares/autenticacion');

const Producto = require('../models/producto');
const setresponse = require('../../util/setresponse');


const app = express();

/*==========================================
/ Metodo get para tomar todos los productos.
/ ==========================================*/

app.get('/producto', (req,res )=>{

    let from = req.query.desde || 0;
    let limite = req.query.limite || 5;

    Producto.find({disponible:true})
            .sort('nombre')
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .skip(Number(from))
            .limit(Number(limite))
            .exec((err, productodb)=>{
                setresponse(err, productodb, res);
            });

} );


/*==========================================
/ Metodo get para tomar un producto.
/ ==========================================*/

app.get('/producto/:id', verificaToken, (req,res )=>{

    let id = req.params.id;

    Producto.findById(id, (err, productodb )=>{
        setresponse(err, productodb, res);

    });

        

} );


/*========================================================
/ Metodo get para busquedas condicionadas en base de datos.
/ ========================================================*/

app.get('/producto/buscar/:termino', (req,res )=>{

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    

    Producto.find({disponible:true, nombre:regex })
            .sort('nombre')
            .populate('categoria', 'descripcion')
            .exec((err, productodb)=>{
                setresponse(err, productodb, res);
            });

} );

/*==========================================
/ Metodo post para crear producto.
/ ==========================================*/

app.post('/producto', verificaToken, (req, res)=>{

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id

    });

    producto.save((err, productodb)=>{
        setresponse(err, productodb, res);

    })

});


/*==========================================
/ Metodo put para actualizar producto.
/ ==========================================*/

app.put('/producto/:id', verificaToken, (req, res)=>{

    let body = req.body;
    let id = req.params.id;
    let productoUpdate = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        disponible: body.disponible
    };

    Producto.findByIdAndUpdate(id, productoUpdate,{new: true}, (err, productodb)=>{

        setresponse(err, productodb, res);

    })

    

});

/*==========================================
/ Metodo delete para borrar un producto.
/ ==========================================*/

app.delete('/producto/:id', verificaToken, (req,res )=>{

    let id = req.params.id;
    let productoOut = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, productoOut, {new: true}, (err, productodb )=>{
        setresponse(err, productodb, res);

    });

        

} );


module.exports = app;