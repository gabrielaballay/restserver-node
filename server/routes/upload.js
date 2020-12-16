const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No selecciono ningún archivo'
            }
        });
    }
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Tipos permitidos
    let tiposVlidos = ['usuarios', 'productos'];
    if (tiposVlidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son ' + tiposVlidos.join(', ')
            }
        })
    }

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extension permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre de archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // ===============
        if (tipo === 'usuarios') {
            imagenUsario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenUsario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraImagen(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraImagen(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el usuario'
                }
            });
        }

        borraImagen(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioModificado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                message: 'Imagen de usuario actualizada',
                usuario: usuarioModificado,
                img: nombreArchivo
            })
        });


    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraImagen(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraImagen(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el producto'
                }
            });
        }

        borraImagen(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoModificado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                message: 'Imagen de producto actualizada',
                usuario: productoModificado,
                img: nombreArchivo
            })
        });
    });
}

function borraImagen(imagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;