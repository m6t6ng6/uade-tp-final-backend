const route = require('express');
const router = route();
const bcrypt = require('bcryptjs');
const conexion = require('../database');
const jwt = require('jsonwebtoken');
const secreto = require('../config');



router.post('/login', (req, res, next) => {
    //res.json('login');
    const userLogin = req.body;
    let email = userLogin.email;
    let password = userLogin.password;
    console.log(email, password);
    let compararPass;
    let acceder;
    let tokenId;
    conexion.query(`SELECT * FROM trabajo_final01.usuarios WHERE
    email = ?`, [email], async function (error, result) {
        if (error) throw error;
        compararPass = await result[0].pass;
        tokenId = await result[0].id_usuario;
        acceder = await bcrypt.compare(password, compararPass);
        console.log(acceder);
        //res.send(acceder);
        if (!acceder) { //if (acceder==false)
            res.status(401).json({auth: false, token: null})
        } else {
            const token = jwt.sign({id: tokenId}, secreto.secret, {
            expiresIn: 60*6*2
                    });
            res.json({auth: true, token: token})
            console.log(token);
            };

    })
    
});

router.post('/register', async (req, res, next) => {
    //res.json('register');
    const usuario = req.body;
    let nombre = usuario.nombre;
    let apellido = usuario.apellido;
    let direccion = usuario.direccion;
    let ciudad = usuario.ciudad;
    let provincia = usuario.provincia;
    let telefono = usuario.telefono;
    let email = usuario.email;
    let pass = await bcrypt.hash(usuario.pass, 10);
    let dni = usuario.dni;
    let estado = usuario.estado;
    let insertID;
    //res.send("El usuario "+nombre+" "+apellido+" a sido creado");
    //console.log(usuario, pass);

    let arrayUsuario = [nombre, apellido, direccion, ciudad, provincia, telefono, email, pass, dni, estado];
        conexion.query(`INSERT INTO trabajo_final01.usuarios (normbre, apellido, direccion, ciudad, id_provincia,
            telefono, email, pass, dni, id_estado) VALUES (?, ?, ?,?,?,?, 
                ?,?,?,?);`, arrayUsuario, async function (error, result) {
            if (error) throw error;
            console.log(result.insertId);
            insertID = await result.insertId;
            const token = jwt.sign({id: insertID}, secreto.secret, {
                expiresIn: 60*60*2 //tiempo en segundos
            });
            res.json({auth: true, token: token});
            console.log("prueba de id: "+insertID);
          });
    
    
    });


router.get('/profile', async (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(400).json({
            auth: false,
            message: 'No has enviado un token'
        });
    }
    const decoded = jwt.verify(token, secreto.secret);
    console.log(decoded);
    conexion.query(`SELECT * FROM trabajo_final01.usuarios WHERE
    id_usuario = ?`, [decoded.id], async function (error, result) {
        if (error) throw error;
        let usuario = await result;
        console.log(usuario);
        res.json(token);
    })
    
});

module.exports = router;