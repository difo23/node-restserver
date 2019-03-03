const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

app.post('/login', (req, res)=>{

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuariodb)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err

            })
        }

        if(!usuariodb){
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos.'
                }
            })
        }
        
        if (!bcrypt.compareSync(body.password, usuariodb.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos.'
                }
            })   
        }

        let token = jwt.sign({
            usuario: usuariodb
        }, process.env.SEED_TOKEN, {expiresIn: process.env.CADUCIDAD_TOKEN})

        res.json({
            ok: true,
            usuario: usuariodb,
            token

        })


    })

})

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, 
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    console.log(payload.name);
    console.log(payload.picture);
    console.log(payload.email);

    return {
        nombre:   payload.name,
        img:  payload.picture,
        email: payload.email,
        google: true
    }
    

  }
 


app.post('/google', async(req, res)=>{

    let token = req.body.idtoken;
    console.log(req.body);
    let googleUser = await verify(token)
    .catch(
        e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        }
    );


    Usuario.findOne({email: googleUser.email}, (err, usuariodb)=>{

        if (err){
            return res.status(500).json({
                ok: false,
                err
            })   
        }

        if(usuariodb){

            if(usuariodb.google === false){

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticacion normal'
                    }
                })   

            }else{
                let token = jwt.sign({
                    usuario: usuariodb
                }, process.env.SEED_TOKEN, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuariodb,
                    token

                })
            }
        }else{

            //si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = 'googlenopasswordneed';

            usuario.save((err,usuariodb)=>{
                
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: usuariodb
                }, process.env.SEED_TOKEN, {expiresIn: process.env.CADUCIDAD_TOKEN});


                return res.json({
                    ok: true,
                    usuario: usuariodb,
                    token

                })

            })
        




        }

    })
    


});

module.exports = app