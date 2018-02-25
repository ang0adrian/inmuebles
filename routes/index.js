var express = require("express");
var router = express.Router();
const Inmueble = require("../models/inmueble");
const Tipo = require("../models/tipo");

router.get("/", function(req, res, next) {
    /*
    let tipo = new Tipo({
      nombre: "paco"
    });
    tipo.save();

    let inmueble = new Inmueble({
        descripcion: "Chalet en mutxamel",
        tipo: '5a71de6d11aa4cb6f12d0d62',
        numeroHabitaciones: 2,
        superficie: 2000,
        precio: 10000
    });
    inmueble.save();
    */

    Inmueble.find()
        .populate("tipo")
        .then(resultado => {
            res.render("index", {
                title: "Inmuebles : Index",
                inmuebles: resultado
            });
        })
        .catch(error => {
            res.render("index", { title: "Inmuebles : Index" });
        });
});

router.get("/nuevo_inmueble", function(req, res, next) {
    res.render("nuevo_inmueble", { title: "Inmuebles : Nuevo Inmueble",errores : '' });
});

router.all("/prohibido", (req, res) => {
    res.send({ ok: false,mensajeError:"Usuario no autentificado",newLocation:"/usuarios/login" });
});
module.exports = router;
