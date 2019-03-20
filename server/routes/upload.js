const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const Usuario = require('../models/usuario')

const Producto = require('../models/producto')


//deafault options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res)=>{


    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se han seleccionado archivos.'
            }
        });
    }

    //validar tipos
    let tiposValidos = ['productos','usuarios'];

    if(tiposValidos.indexOf(tipo)<0){
        return res.status(500).json({
            ok: false,
            messages: `Tipos permitidos ${tiposValidos}`
        })
    }

        //Nombre del archivo cargado
        let sampleFile = req.files.archivo;

        //nombre del archivo cargado
        let nombreArchivo = sampleFile.name.split('.');
        console.log(nombreArchivo);
        let extension = nombreArchivo[nombreArchivo.length-1];

        //extenciones permitidas
        let extensionesValidas= ['png','jpg','gif','jpeg'];

        if (extensionesValidas.indexOf(extension)< 0){

            return res.status(400).json({
                ok: false,
                err: {
                    message: `Las extensiones permitidas son ${extensionesValidas}`,
                     enviaste: extension
                }
            })

        }

        //cambiar nombre al archivo
        let nombreModificado = 
        `${id}-${new Date().getMilliseconds()}.${extension}`;



        sampleFile.mv(`../uploads/${tipo}/${nombreModificado}`, (err )=>{

                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                        
                    })

                }
            //Aqui, imagen cargada
            if(tipo == 'usuarios'){
                imagenUsuario(id, res, nombreModificado);
            }else{
                imagenProducto(id, res, nombreModificado);
            }
          
                
        })
    


})


let imagenUsuario = (id, res , nombreArchivo)=>{

    Usuario.findById(id, (err, usuariodb)=>{
        if(err){
            borrarArchivo(usuariodb.img, 'usuarios' );
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuariodb){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no existe"
                }
            })
        }
        
        borrarArchivo(usuariodb.img, 'usuarios' );

        usuariodb.img= nombreArchivo;

        usuariodb.save((err, usuarioSave)=>{

            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: usuarioSave,
                img: nombreArchivo
            })

        })

    })

}

let imagenProducto = (id, res , nombreArchivo) =>{
    Producto.findById(id, (err, productodb)=>{
        if(err){
            borrarArchivo(productodb.img, 'productos' );
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productodb){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto no existe"
                }
            })
        }
        
        borrarArchivo(productodb.img, 'productos' );

        productodb.img= nombreArchivo;

        productodb.save((err, productoSave)=>{

            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoSave,
                img: nombreArchivo
            })

        })

    })


}

let borrarArchivo = (nombreImagen, tipo ) =>{
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);

    }
}

module.exports = app;