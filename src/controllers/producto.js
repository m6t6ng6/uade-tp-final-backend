import f from '../funciones_app';

export const getAllProducts = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var query = 
"SELECT id_producto, m.nombre AS 'marca', p.nombre AS 'nombre', \
precio, c.nombre AS 'categoria', descripcion, hits_usuario, imagen \
FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
JOIN categorias c ON p.id_categoria = c.id_categoria ORDER BY id_producto;";
  console.log("QUERY: [ " + query + " ]");
  f.query_a_base_de_datos(query)
      .then(resultado => res.status(200).json(resultado), err => console.log(err));
  f.desconectar_db();
}

export const getTop1000HitsProducts = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var query = 
"SELECT id_producto, m.nombre AS 'marca', p.nombre AS 'nombre', \
precio, c.nombre AS 'categoria', descripcion, hits_usuario, imagen \
FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
JOIN categorias c ON p.id_categoria = c.id_categoria ORDER BY hits_usuario DESC LIMIT 1000";
  console.log("QUERY: [ " + query + " ] ");
  f.query_a_base_de_datos(query)
      .then(resultado => res.status(200).json(resultado), err => console.log(err));
  f.desconectar_db();
}

export const getProductById = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var get_usuario = parseInt(req.params.id);
  if (Number.isInteger(get_usuario)) {
      var query = 
"SELECT id_producto, m.nombre AS 'marca', p.nombre AS 'nombre', \
precio, c.nombre AS 'categoria', descripcion, hits_usuario, imagen \
FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
JOIN categorias c ON p.id_categoria = c.id_categoria WHERE id_producto = ?";
      console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
      f.query_a_base_de_datos(query, get_usuario)
          .then(resultado => res.status(200).json(resultado), err => console.log(err));
  } else {
      var msg = { status: 400, error: "id tiene que ser un entero." }
      console.log(msg);
      res.status(400).json(msg);
  }
  f.desconectar_db();
}

export const updateProductHitsById = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var put_usuario = [ req.body.hits_usuario, req.params.id ];
  var query = 
"UPDATE productos SET hits_usuario = ? WHERE id_producto = ?;";
  console.log("QUERY: [ " + query + " ], VARIABLES: [ " + put_usuario + " ]");
  f.query_a_base_de_datos(query, put_usuario)
      .then(resultado => {
          var msg = 
"OK: [ msg: producto modificado correctamente, affectedRows: \
" + resultado.affectedRows + ", message: " + resultado.message + " ]";
          console.log(msg);
          res.status(204).json(msg);
          }, err => console.log(err))
  f.desconectar_db();
}

export const deleteProductById = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var del_usuario = parseInt(req.params.id);
  var query = "DELETE FROM productos WHERE id_producto = ?;"
  console.log("QUERY: [ " + query + " ]");
  f.query_a_base_de_datos(query, del_usuario)
      .then(resultado => res.status(204).json({ status: 204, body: resultado, msg: "elemento borrado correctamente" }), err => console.log(err));
  f.desconectar_db();
}

export const addProduct = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  console.log(req.file);
  var post_usuario = [ req.body.nombre, req.body.id_categoria, req.body.id_marca, req.body.precio, req.body.descripcion, req.file.path ];
  var query = "INSERT INTO productos (nombre, id_categoria, id_marca, precio, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?);";
  console.log("QUERY: [ " + query + " ], VARIABLES: [ " + post_usuario + " ]");
  f.query_a_base_de_datos(query, post_usuario)
      .then(resultado => { var msg = 
"OK: [ msg: producto ingresado correctamente, affectedRows: \
" + resultado.affectedRows + ", insertId: " + resultado.insertId + " ]";
      console.log(msg);
      res.status(201).json(msg);
      }, err => console.log(err))
  f.desconectar_db();
}

export const updateProductoById = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var put_usuario = [ req.body.descripcion, req.body.id_categoria, req.body.id_marca, req.body.nombre, req.body.precio, req.body.imagen, req.params.id_producto ];
  var query = 
"UPDATE productos SET descripcion = ?, id_categoria = ?, id_marca = ?, nombre = ?, precio = ?, imagen = ? WHERE id_producto = ?;";
  console.log("QUERY: [ " + query + " ], VARIABLES: [ " + put_usuario + " ]");
  f.query_a_base_de_datos(query, put_usuario)
      .then(resultado => {
          var msg = 
"OK: [ msg: producto modificado correctamente, affectedRows: \
" + resultado.affectedRows + ", message: " + resultado.message + " ]";
          console.log(msg);
          res.status(204).json(msg);
          }, err => console.log(err))
  f.desconectar_db();
}