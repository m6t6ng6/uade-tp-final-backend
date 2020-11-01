import path from 'path';
import f from './funciones_app';
import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import router from './router';
import dotenv from 'dotenv';

const cors = require('cors');
const { join } = require('path');
const { config, nextTick } = require('process');
const { inherits } = require('util');

const app = express();
const host = process.env.APP_URL;    // URL de la APP
const port = process.env.APP_PORT;   // PUERTO de la APP
app.use(bodyParser.json());
app.options('*', cors());
app.use(cors());

dotenv.config( { path: '../deploy/.env' } );
app.use( morgan( 'dev' ));
router( app );

// ESCUCHA DE IP Y PUERTO
app.listen(port, (err, result) => {
    if (err) throw err;
    console.log('App escuchando en http://' + host + ':' + port);
});

inicio();

// CONEXION A BASE DE DATOS
function inicio() {
    var fecha = f.format_date();
    console.log('Inicio de aplicación. - ' + fecha);
}

//
//
//
//

/// hace publico el acceso desde el front a la carpeta publico del back
const publicDirectory = path.join(__dirname, '../publico/' );
app.use('/', express.static(publicDirectory));
app.use('/uploads', express.static('uploads'));

//
// ACA ABAJO VAN LAS LINEAS DE api_draft.js
//