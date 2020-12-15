const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');
const categoria = require('../models/categoria');
const producto = require('../models/producto');

let app = express();
let Producto = require('../models/producto');

//Mostrar todos los prodcutos
//============================
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

//Mostrar un prodcto por id
//============================
app.get('/producto/:id', verificaToken, (req, res) => {
    // popular: usuario y categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

//Buscar un producto
//============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

//Crear un producto
//============================
app.post('/producto', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar la categoria
    let producto = Producto({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        usuario: req.usuario._id,
        categoria: req.body.categoria
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

//Actualizar un producto
//============================
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoDBM) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDBM
            });
        });
    });
});

//Borrar un producto
//============================
app.delete('/producto/:id', verificaToken, (req, res) => {
    // solo cambia el disponible
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }


        res.json({
            ok: true,
            message: 'Producto ya no disponible',
            producto: productoDB
        });

    });
});


module.exports = app;