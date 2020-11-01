import f from '../funciones_app';

export const getAllProvincies = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var query = "SELECT id_provincia, nombre FROM provincias ORDER BY id_provincia;";
  console.log("QUERY: [ " + query + " ]");
  f.query_a_base_de_datos(query)
      .then(resultado => res.status(200).json(resultado), err => console.log(err));
  f.desconectar_db();
}

export const getProvinceById = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var get_usuario = parseInt(req.params.id);
  if (Number.isInteger(get_usuario)) {
      var query = "SELECT id_provincia, nombre FROM provincias WHERE id_provincia = ?";
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

export const deleteProvinciaById = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var del_usuario = parseInt(req.params.id);
  var query = "DELETE FROM provincias WHERE id_provincia = ?;"
  console.log("QUERY: [ " + query + " ]");
  f.query_a_base_de_datos(query, del_usuario)
      .then(resultado => res.status(204).json(resultado), err => console.log(err));
  f.desconectar_db();
}