const mongoose = require('mongoose');

let TiposSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    login: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
});

let Usuario = mongoose.model('Usuario', TiposSchema);
module.exports = Usuario;