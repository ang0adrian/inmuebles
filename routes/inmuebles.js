var express = require("express");
var router = express.Router();

const Inmueble = require("../models/inmueble");
const Usuario = require("../models/usuario");
const Tipo = require("../models/tipo");

const TokenManagement = require("../helpers/token");

const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const jwt = require("jsonwebtoken");

passport.use(
    new Strategy(
        {
            secretOrKey: TokenManagement.getSecreto(),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        (payload, done) => {
            if (payload.id) {
                return done(null, { id: payload.id });
            } else {
                return done(new Error("Usuario incorrecto"), null);
            }
        }
    )
);

// Get
router.get("/", function(req, res, next) {});

router.get("/:idTipo", function(req, res, next) {
    let parametroTipo = req.params.idTipo;

    let objetoBusqueda = {
        tipo: parametroTipo
    };

    Inmueble.find(objetoBusqueda)
        .populate("tipo")
        .then(resultado => {
            res.render("filtrar_inmuebles", {
                title: "Inmuebles : Categoria",
                inmuebles: resultado
            });
        })
        .catch(error => {
            res.render("filtrar_inmuebles", { title: "Inmuebles : Categoria" });
        });
});

router.get("/:precio/:superficie/:habitaciones", function(req, res, next) {
    let precio = req.params.precio;
    let superficie = req.params.superficie;
    let habitaciones = req.params.habitaciones;

    if (precio == "all") {
        precio = 9999999999;
    }
    if (superficie == "all") {
        superficie = 9999999999;
    }
    if (habitaciones == "all") {
        habitaciones = 9999999999;
    }

    let objetoBusqueda = {
        precio: "",
        superficie: "",
        numeroHabitaciones: ""
    };
    Inmueble.find()
        .where("precio")
        .gte(0)
        .lte(precio)
        .where("superficie")
        .gte(0)
        .lte(superficie)
        .where("numeroHabitaciones")
        .gte(0)
        .lte(habitaciones)

        .then(resultado => {
            console.log(resultado);
            res.render("filtrar_inmuebles", {
                title: "Inmuebles : Filtros Inmuebles",
                inmuebles: resultado
            });
        })
        .catch(error => {
            res.render("filtrar_inmuebles", {
                title: "Inmuebles : Filtros Inmuebles"
            });
        });
});

router.get("/info/:id", function(req, res, next) {
    let id = req.params.id;

    let objetoBusqueda = {
        _id: id
    };

    Inmueble.find(objetoBusqueda)
        .populate("tipo")
        .then(resultado => {
            console.log(resultado);
            res.render("ficha_inmueble", {
                title: "Inmuebles : Inmueble",
                inmueble: resultado[0]
            });
        })
        .catch(error => {
            res.render("ficha_inmueble", { title: "Inmuebles : Inmueble" });
        });
});

// Post
router.post(
    "/",
    passport.authenticate("jwt", {
        session: false,
        failureRedirect: "/prohibido"
    }),
    (req, res) => {
        let descripcion = req.body.descripcion;
        let tipo = req.body.tipo.trim();
        let habitaciones = req.body.habitaciones;
        let superficie = req.body.superficie;
        let precio = req.body.precio;

        if (req.files) {
            req.files.imagen.mv(
                "./public/images/inmuebles/" + req.files.imagen.name,
                err => {
                    if (err) {
                        console.log(err);
                    }

                    let inmueble = new Inmueble({
                        descripcion: descripcion,
                        tipo: tipo,
                        numeroHabitaciones: habitaciones,
                        superficie: superficie,
                        precio: precio,
                        imagen: "/images/inmuebles/" + req.files.imagen.name
                    });

                    inmueble.save();
                    console.log(
                        "--------------------------------> Redirect Imagen"
                    );
                    res.send({
                        ok: true,
                        newLocation: "/"
                    });
                }
            );
        } else {
            let inmueble = new Inmueble({
                descripcion: descripcion,
                tipo: tipo,
                numeroHabitaciones: habitaciones,
                superficie: superficie,
                precio: precio,
                imagen: req.files.imagen.name
            });

            inmueble.save();
            console.log(
                "--------------------------------> Redirect Sin Imagen"
            );
            res.send({
                ok: true,
                newLocation: "/"
            });
        }
    }
);

// Delete
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false,
        failureRedirect: "/prohibido"
    }),
    function(req, res, next) {
        let id = req.params.id;
        let objetoRespuesta = {
            ok: false,
            newLocation: "",
            mensajeError: ""
        };

        let objetoBusqueda = {
            _id: id
        };

        Inmueble.find(objetoBusqueda)
            .populate("tipo")
            .then(resultado => {
                if (resultado.length === 0) {
                    objetoRespuesta.mensajeError =
                        "No se ha encontrado el inmueble especificado.";
                    res.send(objetoRespuesta);
                }
            })
            .catch(error => {
                objetoRespuesta.mensajeError =
                    "Se ha producido un error al eliminar el inmueble : " +
                    error;
                res.send(objetoRespuesta);
            });

        // Borra el inmueble
        Inmueble.find(objetoBusqueda)
            .remove()
            .catch(error => {
                objetoRespuesta.mensajeError =
                    "Se ha producido un error al eliminar el inmueble : " +
                    error;
                res.send(objetoRespuesta);
            });

        // Compruebo que no existe
        Inmueble.find(objetoBusqueda)
            .populate("tipo")
            .then(resultado => {
                if (resultado.length === 0) {
                    objetoRespuesta.ok = true;
                    objetoRespuesta.newLocation = "/";
                    res.send(objetoRespuesta);
                } else {
                    objetoRespuesta.mensajeError = "No se ha podido eliminar el inmueble".res.send(
                        objetoRespuesta
                    );
                }
            })
            .catch(error => {
                objetoRespuesta.mensajeError =
                    "Se ha producido un error al eliminar el inmueble : " +
                    error;
                res.send(objetoRespuesta);
            });
    }
);

module.exports = router;
