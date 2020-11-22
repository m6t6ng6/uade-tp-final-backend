import f from '../funciones_app';


export const createBrand = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  const post_usuario = [ req.body.nombre ];
  var query = "INSERT INTO marcas (nombre) VALUES (?);";
  console.log("QUERY: [ " + query + " ]");
  f.query_a_base_de_datos(query, post_usuario)
  .then(resultado => {
    const msg = {estado: 201, id_marca: resultado.insertId, nombre: req.body.nombre, mensaje: "Marca añadida correctamente."}
    res.status(200).json(msg)}, err => console.log(err)
    );
    f.desconectar_db();
  }
    

export const getAllBrands = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var query = "SELECT id_marca, nombre FROM marcas ORDER BY id_marca;";
  console.log("QUERY: [ " + query + " ]");
  f.query_a_base_de_datos(query)
      .then(resultado => res.status(200).json(resultado), err => console.log(err));
  f.desconectar_db();
}

export const getBrandById = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var get_usuario = parseInt(req.params.id);
  if (Number.isInteger(get_usuario)) {
      var query = "SELECT id_marca, nombre FROM marcas WHERE id_marca = ?";
      console.log("QUERY: [ " + query + " ]");
      f.query_a_base_de_datos(query, get_usuario)
          .then(resultado => res.status(200).json(resultado), err => console.log(err));
  } else {
      var msg = { status: 400, error: "id_marca tiene que ser un entero" };
      console.log(msg);
      res.status(400).json(msg);
  }
  f.desconectar_db();
}

export const deleteBrandById = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var del_usuario = parseInt(req.params.id);
  var query = "DELETE FROM marcas WHERE id_marca = ?;"
  console.log("QUERY: [ " + query + " ]");
  f.query_a_base_de_datos(query, del_usuario)
      .then(resultado => {
        const msg = {estado: 204, id_marca: del_usuario, mensaje: "Marca eliminada correctamente."}
        res.status(204).json(msg)}, err => console.log(err)
      );
  f.desconectar_db();
}
