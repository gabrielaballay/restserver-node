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
    urlDB = 'mongodb+srv://cafe1234:cafe1234@cluster0.nttvu.mongodb.net/cafe?retryWrites=true&w=majority';
}
process.env.URLDB = urlDB;