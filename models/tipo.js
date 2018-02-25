var mongoose = require("mongoose");

let tipoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

let Tipo = mongoose.model("tipo", tipoSchema);

module.exports = Tipo;
