const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _= require('underscore');
const Usuario = require('../models/usuario');
const {verificaToken, verificarAdminRole} = require('../middlewares/autenticacion');

app.get('/usuario', verificaToken, (req,res)=>{


    //  return res.json(
    //  {
    //      usuario: req.usuario,
    //        nombre: req.usuario.nombre,
    //        email: req.usuario.email,
    //     }
    // )

    let from = req.query.desde || 0;
    let limite = req.query.limite || 5;

    Usuario.find({estado:true},'nombre email role estado google img')
            .skip(Number(from))
            .limit(Number(limite))
            .exec((err, usuarios)=>{

                if(err) {
                    return res.status(400).json({
                         ok: false,
                         err
                     });
                 }
                 
                 Usuario.count({estado:true},(err,count)=>{


                 res.json({
                    ok: true,
                    count,
                    usuarios
        
                })

                 });
               
         

            })
    //res.json('Get');
})

app.post('/usuario',[verificaToken, verificarAdminRole], (req,res)=>{

    let body = req.body;
    
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        role: body.role,
        password: bcrypt.hashSync( body.password, 10)
    });

    usuario.save((err, usuariodb)=>{
        if(err) {
           return res.status(400).json({
                ok: false,
                err
            });
        }

      

        res.json({
            ok: true,
            usuario: usuariodb

        })
    });

})

app.put('/usuario/:id', [verificaToken, verificarAdminRole], (req,res)=>{
    let id= req.params.id;
    
    let body = _.pick(req.body,  ['nombre', 'img', 'email', 'role', 'estado'] );

    //new : true se asegura de enviar el objeto actualizado como respuesta

    Usuario.findByIdAndUpdate(id, body,{new:true, runValidators: true, context: 'query'}, (err, usuariodb)=>{

        if(err) {
            return res.status(400).json({
                 ok: false,
                 err
             });
         }
 
    //    console.log(usuariodb);
 
         res.json({
             ok: true,
             usuario: usuariodb
 
         })

    });

});

app.delete('/usuario/:id', [verificaToken, verificarAdminRole], (req,res)=>{
   
   let id = req.params.id;

   //eliminar fisicamente

//    Usuario.findByIdAndRemove(id, (err, deleteUser)=>{

//     if(err) {
//         return res.status(400).json({
//              ok: false,
//              err
//          });
//      }

//      if(!deleteUser) {
//         return res.status(400).json({
//              ok: false,
//              err:{
//                  message: 'usuario no encontrado'
//              }
//          });
//      }

//      res.json({
//          ok: true,
//          deleteUser
//      })

//    });

//poner el estado como false

Usuario.findByIdAndUpdate(id, {estado: false},{new:true}, (err, deleteUser)=>{

    if(err) {
                return res.status(400).json({
                     ok: false,
                     err
                 });
             }
        
             if(!deleteUser) {
                return res.status(400).json({
                     ok: false,
                     err:{
                         message: 'usuario no encontrado'
                     }
                 });
             }
        
             res.json({
                 ok: true,
                 deleteUser
             })
        
    
       });

   
    // res.json('Delete');
})


module.exports = app;