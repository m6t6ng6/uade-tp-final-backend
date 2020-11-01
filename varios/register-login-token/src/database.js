const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "acevedo535",
    database: "trabajo_final01"
});

conexion.connect(function(error){
    if (error) throw error;
    console.log('conexión establecida');
})

module.exports = conexion;