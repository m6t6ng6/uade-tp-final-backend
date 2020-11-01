import f from '../funciones_app';

export const getAllStatuses = (req, res) => {
  f.conectar_a_mysql();
  f.conectar_a_base_de_datos('trabajo_final01');
  var query = "SELECT id_estado, perfil FROM estados";
  console.log("QUERY: [ " + query + " ]");
  f.query_a_base_de_datos(query)
      .then(resultado => res.status(200).json(resultado), err => console.log(err));
  f.desconectar_db();
}