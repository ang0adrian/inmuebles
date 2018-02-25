const express = require("express");
let router = express.Router();
const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALTROUNDS = 12;
const TokenManagement = require("../helpers/token");

router.get("/login", (req, res) => {
    res.render("login", { title: "Login" });
});

router.get("/registro", (req, res) => {
    res.render("registro", { title: "Registro" });
});

router.post("/registro", (req, res) => {
    bcrypt
        .hash(req.body.password, SALTROUNDS)
        .then(hash => {
            req.body.password = hash;
            return new Usuario(req.body).save();
        })
        .then(resultado => {
            res.redirect("login");
        })
        .catch(error => {
            let errorsResult = error.message.split(",");
            res.locals.item = {};
            res.locals.errors.push(...errorsResult);
            res.render("registro");
        });
});

router.post("/login", (req, res) => {
    Usuario.findOne({ login: req.body.usuario })
        .then(resultado => {
            if (resultado) {
                bcrypt
                    .compare(req.body.password, resultado.password)
                    .then(result => {
                        if (result) {
                            res.send({
                                ok: true,
                                token: TokenManagement.generateToken(
                                    resultado._id
                                ),
                                newLocation: "/"
                            });
                        } else {
                            res.send({
                                ok: false,
                                mensajeError: "Usuario incorrecto"
                            });
                        }
                    });
            } else {
                res.send({ ok: false, mensajeError: "Usuario no encontrado" });
            }
        })
        .catch(error => {
            res.send({
                ok: false,
                mensajeError: "Usuario incorrecto. Error " + error
            });
        });
});

module.exports = router;
