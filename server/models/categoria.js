const mongoose = require('mongoose')
const Schema = mongoose.Schema;
//FIXME: Arreglame
let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' }
});
//TODO: Revisar la exportacion

module.exports = mongoose.model('Categoria', categoriaSchema);