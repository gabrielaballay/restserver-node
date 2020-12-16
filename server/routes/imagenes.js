const express = require('express');
const { replaceOne } = require('../models/usuario');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');

let app = express();

app.get('/imagenes/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let noPathImagen = path.resolve(__dirname, `../assets/no-image.jpg`);
        res.sendFile(noPathImagen);
    }

});

module.exports = app;