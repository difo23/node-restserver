const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es valido'

}

let usuarioSchema = new Schema({
    nombre:{
     type: String,
     required: [true, 'el nombre es necesario']
    },
    password: {
        type: String,
        required: [true, 'El password es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type:String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        required: false
    }


});

usuarioSchema.methods.toJSON = function (){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} Debe ser Unico'})
module.exports = mongoose.model('usuario', usuarioSchema);