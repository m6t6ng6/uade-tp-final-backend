import f from '../funciones_app';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
const secreto = process.env.SECRET;  // SECRETO de BCRYPT


export const mostrarCompras = async (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  const id_usuario = await f.decodeId(req.headers);
  console.log(id_usuario);
  const query = "SELECT d.id_producto, d.nombre AS Producto, d.descripcion AS DescProduct, importe, \
  id_vendedor, f.nombre AS NombreVendedor, f.apellido AS ApellidoVendedor, \
  d.imagen AS imagenProducto, b.fecha \
  FROM trabajo_final01.usuarios a \
  JOIN trabajo_final01.operaciones b ON a.id_usuario = b.id_comprador \
  JOIN trabajo_final01.usuarios f ON f.id_usuario = b.id_vendedor \
  JOIN trabajo_final01.productos_operaciones c ON b.id_operacion = c.id_operacion \
  JOIN trabajo_final01.productos d ON c.id_producto = d.id_producto \
  WHERE a.id_usuario = ?;";
  console.log({ query: query, variables: { id_usuario: id_usuario } });
  f.query_a_base_de_datos(query, id_usuario, async function (error, result) {
    if (error) throw error;
    let datos_usuario = await result;
    console.log(datos_usuario);
    res.status(200).json({ status: 200, data: datos_usuario, message: "Listado de compras del usuario." });
  }) 
}

export const getUserLogin = (req, res, next) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  const get_usuario = [ req.body.email, req.body.password ];
  console.log(get_usuario);
  const query = "SELECT * FROM usuarios WHERE email = ?;";
  console.log({ query: query, variables: get_usuario });
  f.query_a_base_de_datos(query, req.body.email, async function (error, result) {
  if (error) throw error;
    let validacion = await result[0].codigo;
    let acceder = await f.validar_password(await req.body.password, await result[0].pass);
    let tokenId = await result[0].id_usuario;
  if (!acceder) { //if (acceder==false)
    let msg = {auth: false, token: null, codigoValidacion: "Usuario validado previamente por código."}
    console.log(msg);
    res.status(401).json(msg);
  } else if (acceder && validacion === 'validado') {
    const token = jwt.sign({id: tokenId}, secreto, {
      expiresIn: 60*60*12   // tiempo en segundos
    });
    let msg = {status: 202, auth: true, token: token, codigoValidacion: "Usuario validado previamente por código."}
    console.log(msg);
    console.log(token);
    res.json(msg);
  } else if (acceder && validacion != 'validado') {
    let msg = {auth: false, token: null, codigoValidacion: "Usuario pendiente de validación por código."}
    console.log(msg);
    res.status(401).json(msg);
  };
  })
}

export const getUserProfile = async (req, res) => {
  const util = require('util');
  const db = require('mysql');
  const host = process.env.MYSQL_HOST;
  const nombre_de_base_de_datos = 'trabajo_final01';
  const con = db.createConnection(config);
  // node native promisify
  const query = util.promisify(con.query).bind(con);

  con.connect(err => {
      if (err) throw err;
      console.log("Conectado a la base de datos " + host + ".");
  });

  con.changeUser({database: nombre_de_base_de_datos}, err => {
    if (err) throw err;
    console.log("Cambio a base de datos: '" + nombre_de_base_de_datos + "'.") 
  });
 
  const id_usuario = await f.decodeId(req.headers);

  const query1 = "SELECT id_usuario, u.nombre, apellido, email, dni, \
  ciudad, direccion, estado, p.nombre AS 'provincia', pass, telefono, imagen \
  FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
  JOIN provincias p ON u.id_provincia = p.id_provincia WHERE id_usuario = ?";
  console.log({ query: query1, variables: { id_usuario: id_usuario } });
  const resultado1 = await query(query1, id_usuario);

  const query2 = "SELECT c.id_producto, a.nombre, apellido, direccion, ciudad, e.nombre AS provincia, telefono, email, \
  a.imagen AS imagenUsuario, c.descripcion AS descripcionProducto, c.nombre AS nombreProducto, c.imagen AS imagenProducto, precio, cantidad \
  FROM trabajo_final01.usuarios a \
  LEFT JOIN trabajo_final01.productos_usuarios b \
  ON a.id_usuario = b.id_usuario \
  JOIN trabajo_final01.productos c \
  ON b.id_producto = c.id_producto \
  JOIN trabajo_final01.marcas d \
  ON c.id_marca = d.id_marca \
  JOIN trabajo_final01.provincias e \
  ON a.id_provincia = e.id_provincia \
  WHERE a.id_usuario = ?;";
  console.log({ query: query2, variables: { id_usuario: id_usuario } });
  const resultado2 = await query(query2, id_usuario);

  const msg = {estado: 201, info_usuario: resultado1, data_productos: resultado2}

  console.log(msg);

  res.status(201).json(msg);

  f.desconectar_db();
}



export const getUserProfileOriginal = async (req, res, next) => {
  const id_usuario = await f.decodeId(req.headers);
  const query = "SELECT a.nombre, apellido, direccion, ciudad, e.nombre AS provincia, telefono, email, \
  a.imagen AS imagenUsuario, c.descripcion AS descripcionProducto, c.nombre AS nombreProducto, c.imagen AS imagenProducto, precio, cantidad \
  FROM trabajo_final01.usuarios a \
  LEFT JOIN trabajo_final01.productos_usuarios b \
  ON a.id_usuario = b.id_usuario \
  JOIN trabajo_final01.productos c \
  ON b.id_producto = c.id_producto \
  JOIN trabajo_final01.marcas d \
  ON c.id_marca = d.id_marca \
  JOIN trabajo_final01.provincias e \
  ON a.id_provincia = e.id_provincia \
  WHERE a.id_usuario = ?;";
  console.log({ query: query, variables: { id_usuario: id_usuario } });
  f.query_a_base_de_datos(query, id_usuario, async function (error, result) {
    if (error) throw error;
    let datos_usuario = await result;
    console.log(datos_usuario);
    res.status(202).json({ status: 202, data: datos_usuario, message: "Autenticación correcta" });
  })
}

export const getAllUsers = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', \
pass, telefono, imagen FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia ORDER BY id_usuario;";
  console.log("QUERY: [ " + query + " ]");
  f.query_a_base_de_datos(query)
      .then(resultado => res.status(200).json(resultado), err => console.log(err));
}

export const getUserByEmail = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var get_usuario = req.params.email;
  var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', pass, telefono, imagen \
FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia WHERE email = ?";
      console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
      f.query_a_base_de_datos(query, get_usuario)
          .then(resultado => res.status(200).json(resultado), err => console.log(err));
  f.desconectar_db();
}

export const getUserById = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var get_usuario = parseInt(req.params.id);
  if (Number.isInteger(get_usuario)) {
      var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', pass, telefono, imagen \
FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia WHERE id_usuario = ?";
      console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
      f.query_a_base_de_datos(query, get_usuario)
          .then(resultado => res.status(200).json(resultado), err => console.log(err));
  } else {
      var msg = { status: 400, error: "id_usuario tiene que ser un entero" };
      console.log(msg);
      res.status(400).json(msg);
  }
  f.desconectar_db();
}

export const createUser = async (req, res, next) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var codigo = Math.random().toString(36).substring(2, 10);    // crea codigo de 8 caracteres aleatorios
  var fechaCreacionCodigo = f.format_date();           // fecha en la que fue creado el codigo
  let passEncriptado = await bcrypt.hash(req.body.pass, 10);
  var post_usuario = [ req.body.apellido, req.body.ciudad, req.body.direccion, req.body.dni,
                       req.body.email, req.body.id_estado, req.body.id_provincia, req.body.nombre,
                       passEncriptado, req.body.telefono, req.file.path, codigo, fechaCreacionCodigo ];
  var query = 
"INSERT INTO usuarios (apellido, ciudad, direccion, dni, email, id_estado, \
id_provincia, nombre, pass, telefono, imagen, codigo, codigo_validez) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
  console.log({ query: query, variables: post_usuario });
  f.query_a_base_de_datos(query, post_usuario, async function (error, result) {
      if (error) throw error;
      const token = jwt.sign({id: result.insertId}, secreto, {
          expiresIn: 60*60*12 //tiempo en segundos
      });
      var msg = { auth: true, token: token, status: "201", msg: "usuario creado correctamente", affectedRows: result.affectedRows, insertId: result.insertId };
      console.log(msg);
      res.status(201).json(msg);
      var texto = "Bienvenido a Whales. Ingresá a http://whales.matanga.net.ar/validacion y pegá este código de validación para habilitar tu cuenta: " + codigo + ". Recordá que el código tiene validez por 12 horas.";
      f.enviar_correo("Whales", req.body.email, "Whales correo de Validación", texto);
      //}, err => { res.status(500).json(err); console.log(err) });
  }).then(resultado => {}, err => { res.status(500).json(err); console.log(err) });
  f.desconectar_db();
}

export const validateUser = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var fechaActual = new Date();     // fecha y hora de cuando se coloca el codigo recibido
  var post_usuario = [ req.body.codigo, req.body.email];
  //var post_usuario = [ req.body.codigo, req.body.email, req.body.password ];
  var query = "SELECT id_usuario, email, pass, imagen, codigo, codigo_validez FROM usuarios WHERE codigo = ? AND email = ?";
  //var query = "SELECT id_usuario, email, pass, imagen, codigo, codigo_validez FROM usuarios WHERE codigo = ? AND email = ? AND pass = ?;";
  console.log({ query: query, variables: post_usuario });
  f.query_a_base_de_datos(query, post_usuario, async function (error, resultado) {
    let passValida = await f.validar_password(await req.body.password, await resultado[0].pass);
    if ( resultado.length > 0 ) {
      if ( resultado[0].codigo != "validado" && resultado[0].codigo === req.body.codigo && resultado[0].email === req.body.email && passValida ) {
                  var diff = (fechaActual - new Date(resultado[0].codigo_validez)) / (1000 * 60 * 60);    // coeficiente de diferencia entre fechas medido en horas (ej: 1.5 significa que paso 1 hora y media)
                  if ( diff < 12 ) {
                      var query = "UPDATE usuarios SET codigo = 'validado' WHERE id_usuario = " + resultado[0].id_usuario + ";";
                      f.query_a_base_de_datos(query)
                          .then(resultado => {
                              var msg = { status: 202, msg: "usuario validado" };
                              var texto = "Tu código fue validado satisfactoriamente. Disfrutá comprar y vender en un sólo lugar rápido, fácil y seguro.";
                              f.enviar_correo("Whales", req.body.email, "Bienvenido a Whales", texto);
                              console.log(msg);
                              res.status(201).json(msg);
                          }, err => { res.status(500).json(err); console.log(err) });
                  } else {   // si es mayor a 12 horas la introduccion del codigo, se crea un codigo nuevo y se envia nuevamente al cliente para que valide
                      var codigo = Math.random().toString(36).substring(2, 10);    // crea codigo de 8 caracteres aleatorios
                      var fechaCreacionCodigo = f.format_date();           // fecha en la que fue creado el codigo
                      var query = "UPDATE usuarios SET codigo = '" + codigo + "', codigo_validez = '" + fechaCreacionCodigo + "' WHERE id_usuario = " + resultado[0].id_usuario + ";";
                      f.query_a_base_de_datos(query)
                          .then(resultado => {
                              var msg = { status: 401, msg: "no autorizado 3" };
                              var texto = "Bienvenido a Whales. Ingresá a http://whales.matanga.net.ar/validacion y pegá este código de validación para habilitar tu cuenta: " + codigo + ". Recordá que el código tiene validez por 12 horas.";
                              f.enviar_correo("Whales", req.body.email, "Bienvenido a Whales", texto);
                              console.log(msg);
                              res.status(201).json(msg);
                          }, err => { res.status(500).json(err); console.log(err) });
                  }
              } else {
                  var msg = { status: 401, msg: "no autorizado 2" };
                  console.log(msg);
                  res.status(201).json(msg);
              }
          } else if ( resultado.length === 0 ) {
              var msg = { status: 401, msg: "no autorizado 1" };
              console.log(msg);
              res.status(201).json(msg); 
          }
      }, err => { res.status(500).json(err); console.log(err) });
}

export const updateUserById = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var put_usuario = [ req.body.apellido, req.body.ciudad, req.body.direccion, req.body.dni,
                       req.body.email, req.body.id_estado, req.body.id_provincia, req.body.nombre,
                       req.body.pass, req.body.telefono, req.body.imagen, req.params.id ];
  var query = 
"UPDATE usuarios SET apellido = ?, ciudad = ?, direccion = ?, dni = ?, email = ?, \
id_estado = ?, id_provincia = ?, nombre = ?, pass = ?, telefono = ?, imagen = ? WHERE id_usuario = ?;";
  console.log("QUERY: [ " + query + " ], VARIABLES: [ " + put_usuario + " ]");
  f.query_a_base_de_datos(query, put_usuario)
      .then(resultado => {
          var msg = 
"OK: [ msg: producto modificado correctamente, affectedRows: " + resultado.affectedRows + "\
, message: " + resultado.message + " ]";
          console.log(msg);
          res.status(204).json(msg);
          }, err => console.log(err));
  f.desconectar_db();
}

export const deleteUserById = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var del_usuario = parseInt(req.params.id);
  var query = "DELETE FROM usuarios WHERE id_usuario = ?;"
  console.log(query);
  f.query_a_base_de_datos(query, del_usuario)
      .then(resultado => res.send(resultado), err => console.log(err));
  f.desconectar_db();
}