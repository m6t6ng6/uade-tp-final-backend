const db = require('mysql');
const credenciales = require('./setup.js');    // credenciales
const nodemailer = require('nodemailer');   // paquete de nodemailer
const Promise = require('promise');   // paquete de promesas
const express = require('express');
const bodyParser = require('body-parser');
const { inherits } = require('util');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { decode } = require('punycode');
const secreto = process.env.SECRET;  // SECRETO de BCRYPT

config = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD
}

async function validar_password(passwordEnviado, passwordDB) {
    acceder = await bcrypt.compare(passwordEnviado, passwordDB);
    if (!acceder) return false;
    else return true;
}

module.exports.validar_password = validar_password;

module.exports.conectar_a_mysql = () => {
    con = db.createConnection(config);
    con.connect(err => {
        if (err) throw err;
        console.log("Conectado a la base de datos " + config.host + ".");
        return true;
    });
};

module.exports.desconectar_db = () => {
    con.end(err => {
        if (err) {
            return console.log("Error al cerrar la conexión hacia la base de datos." + err.message);
        }
        console.log("Conexión a la base de datos cerrada.");
    });
};

function listar_bases_de_datos_callback (err, resultado) {
    var lista = [];
    if (err) return console.log(err);
    if (resultado.length) {
        var lista = rawDataPacket_a_array(resultado, "Database");
        console.log(lista);
        return lista;
    }
}

module.exports.listar_bases_de_datos = () => con.query("SHOW DATABASES", listar_bases_de_datos_callback);

module.exports.conectar_a_base_de_datos = (nombre_de_base_de_datos) => {
    con.changeUser({database: nombre_de_base_de_datos}, err => {
        if (err) throw err;
        console.log("Cambio a base de datos: '" + nombre_de_base_de_datos + "'.") 
    });
    return nombre_de_base_de_datos;
}

function rawDataPacket_a_array (resultado, nombre_de_campo) {
    array_de_elementos = [];
    for ( var indice in resultado ) {
        array_de_elementos.push(resultado[indice][nombre_de_campo]);
    };
    return array_de_elementos;
}

function listar_tablas_callback (err, resultado) {
    var lista = [];
    if (err) return console.log(err);
    if (resultado.length) {
        var lista = rawDataPacket_a_array(resultado, "table_name");
        console.log(lista);
        return lista;
    }
}

module.exports.listar_tablas = (nombre_de_la_base_de_datos) => con.query("SELECT table_name FROM information_schema.tables WHERE table_schema = '" + nombre_de_la_base_de_datos + "'", listar_tablas_callback);

module.exports.query_a_base_de_datos = (query, array_get_usuario, cb) => {
    return new Promise((resolve, reject) => {
        if (!array_get_usuario) {
            con.query(query, (err, resultado) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(resultado);
                    resolve(resultado);
                }
            });    
        } if (array_get_usuario && !cb) {
            con.query(query, array_get_usuario, (err, resultado) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(resultado);
                    resolve(resultado);
                }
            }); 
        } if (array_get_usuario && cb) {
            con.query(query, array_get_usuario, cb, (err, resultado) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(resultado);
                    resolve(resultado);
                }
            }); 
        }
    });
}

module.exports.insert_a_base_de_datos = (nombre_de_tabla, array_de_campos, array_de_valores) => {
    console.log(array_de_valores.join("', '"));
    con.query("INSERT INTO " + nombre_de_tabla + " (" + array_de_campos.join() + ") VALUES ('" + array_de_valores.join("', '") + "')", (err, resultado) => {
        if (err) throw err;
        console.log(resultado);
    });
}

module.exports.format_date = () => {
    // entrega horario local del servidor
    var date = new Date();
    var date = date.setHours(date.getHours() - date.getTimezoneOffset()/60);
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}


// ENVIO CORREO
module.exports.enviar_correo = (from_string, to_string, asunto, texto) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: credenciales.email_auth.uade_testing.user,
          pass: credenciales.email_auth.uade_testing.pass 
      }
    });
  
    let mailOptions = {
      from: from_string,
      to: to_string,
      subject: asunto, 
      text: texto
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
}

async function decodeId(headers) {
    //let token = req.headers['x-access-token'];
    let token = headers['x-access-token'];
    if (!token) {
      msg = {
        auth: false,
        message: 'No has enviado un token'
      }
      console.log(msg);
      return res.status(400).json(msg);
    } else {
        const decoded = await jwt.verify(token, secreto);
        var msg = { token: token, id_usuario: decoded.id}
        return decoded.id
    }
}

module.exports.decodeId = decodeId;
