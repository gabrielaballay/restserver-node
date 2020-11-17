//====================
//  PUERTO
//====================

process.env.PORT = process.env.PORT || 3000;

//====================
//  Entorno
//====================

process.env.NODE_ENV = process.env.NODE_ENV || 'env';

//====================
//  Base de Datos
//====================

let urlDB;
if (process.env.NODE_ENV === 'env') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI; //+'&w=majority';
}
process.env.URLDB = urlDB;

//=====================
//Vencimiento del token
//=====================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=======================
//  SEED de autenticación
//=======================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//=======================
//  Google Client ID
//=======================

process.env.CLIENT_ID = process.env.CLIENT_ID || '817168359954-83k554bad2fp0ks80r0ud2a8d3klilj6.apps.googleusercontent.com';