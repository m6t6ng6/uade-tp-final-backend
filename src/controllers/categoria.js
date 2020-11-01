import f from '../funciones_app';

export const getAllCategories = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var query = "SELECT id_categoria, nombre FROM categorias ORDER BY id_categoria;";
  console.log("QUERY: [ " + query + " ]");
  f.query_a_base_de_datos(query)
      .then(resultado => res.status(200).json(resultado), err => console.log(err));
  f.desconectar_db();
}

export const getCategoryById = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var get_usuario = parseInt(req.params.id);
  if (Number.isInteger(get_usuario)) {
      var query = "SELECT id_categoria, nombre FROM categorias WHERE id_categoria = ?";
      console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
      f.query_a_base_de_datos(query , get_usuario)
          .then(resultado => res.status(200).json(resultado), err => console.log(err));
  } else {
      var msg = { status: 400, error: "id tiene que ser un entero" };
      console.log(msg);
      res.status(400).json(msg);
  }
  f.desconectar_db();
}