////
// ESTAS LINEAS VAN AL FINAL DE app.js
////

//
// CATEGORIAS
//

// GET /categorias

// GET /categorias/:id_categoria

//
// PROVINCIAS
//

// GET /provincias


// GET /provincias/:id_provincia


// DELETE /provincias/:id_provincia

//
// MARCAS
//

// GET /marcas


// GET /marcas/:id_marca


// DELETE /marcas/:id_marca

//
// ESTADOS
//

// GET /estados

//
// PRODUCTOS
//

// GET /productos


// GET /productos/hits


// GET /productos/:id_producto


// POST /productos
// no permite modificar los hits_usuario para mantener integridad -------- A REVISAR CON LEO
app.post('/productos', upload.single('imagen'), (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    console.log(req.file);
    var post_usuario = [ req.body.nombre, req.body.id_categoria, req.body.id_marca, req.body.precio, req.body.descripcion, req.file.path ];
    var query = "INSERT INTO productos (nombre, id_categoria, id_marca, precio, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?);";
    console.log("QUERY: [ " + query + " ], VARIABLES: [ " + post_usuario + " ]");
    f.select_a_base_de_datos(query, post_usuario)
        .then(resultado => { var msg = 
"OK: [ msg: producto ingresado correctamente, affectedRows: \
" + resultado.affectedRows + ", insertId: " + resultado.insertId + " ]";
        console.log(msg);
        res.send(msg);
        }, err => console.log(err))
    f.desconectar_db();
});

// PUT /productos/:id_producto
app.put('/productos/:id_producto', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var put_usuario = [ req.body.descripcion, req.body.id_categoria, req.body.id_marca, req.body.nombre, req.body.precio, req.body.imagen, req.params.id_producto ];
    var query = 
"UPDATE productos SET descripcion = ?, id_categoria = ?, id_marca = ?, nombre = ?, precio = ?, imagen = ? WHERE id_producto = ?;";
    console.log("QUERY: [ " + query + " ], VARIABLES: [ " + put_usuario + " ]");
    f.select_a_base_de_datos(query, put_usuario)
        .then(resultado => {
            var msg = 
"OK: [ msg: producto modificado correctamente, affectedRows: \
" + resultado.affectedRows + ", message: " + resultado.message + " ]";
            console.log(msg);
            res.send(msg);
            }, err => console.log(err))
    f.desconectar_db();
});

// PUT /productos/:id_producto/hits

// DELETE /productos/:id_producto

//
// USUARIOS
//

// GET /usuarios
app.get('/usuarios', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', \
pass, telefono, imagen FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia ORDER BY id_usuario;";
    console.log("QUERY: [ " + query + " ]");
    f.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

// GET /usuarios/:email
// devuelve los usuarios con el correo :email
app.get('/usuarios/:email', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = req.params.email;
    var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', pass, telefono, imagen \
FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia WHERE email = ?";
        console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
        f.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    f.desconectar_db();
});

// GET /usuarios/:id_usuarios
app.get('/usuarios/:id_usuario', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = parseInt(req.params.id_usuario);
    if (Number.isInteger(get_usuario)) {
        var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', pass, telefono, imagen \
FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia WHERE id_usuario = ?";
        console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
        f.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        var msg = "ERROR: [ msg: id_usuario tiene que ser un entero ]";
        console.log(msg);
        res.send(msg);
    }
    f.desconectar_db();
});

// modelo
// POST /usuarios
app.post('/usuarios', upload.single('imagen'), async (req, res, next) => {
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
    f.select_a_base_de_datos(query, post_usuario, async function (error, result) {
        if (error) throw error;
        insertID = await result.insertId;
        const token = jwt.sign({id: insertID}, secreto, {
            expiresIn: 60*60*2 //tiempo en segundos
        });
        var msg = { auth: true, token: token, status: "201", msg: "usuario creado correctamente", affectedRows: result.affectedRows, insertId: result.insertId };
        console.log(msg);
        res.status(201).json(msg);
        var texto = "Bienvenido a Whales. Ingresá a http://whales.matanga.net.ar/validacion y pegá este código de validación para habilitar tu cuenta: " + codigo + ". Recordá que el código tiene validez por 12 horas.";
        f.enviar_correo("Whales", req.body.email, "Whales correo de Validación", texto);
        //}, err => { res.status(500).json(err); console.log(err) });
    }).then(resultado => {}, err => { res.status(500).json(err); console.log(err) });
    f.desconectar_db();
});

// POST /usuarios/validacion
app.post('/usuarios/validacion', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var fechaActual = new Date();     // fecha y hora de cuando se coloca el codigo recibido
    var post_usuario = [ req.body.codigo, req.body.email, req.body.pass ];
    query = "SELECT id_usuario, email, pass, imagen, codigo, codigo_validez FROM usuarios WHERE codigo = ? AND email = ? AND pass = ?;";
    console.log({ query: query, variables: post_usuario });
    f.select_a_base_de_datos(query, post_usuario)
        .then(resultado => {
            if ( resultado.length > 0 ) {
                if ( resultado[0].codigo != "validado" && resultado[0].codigo === req.body.codigo && resultado[0].email === req.body.email && resultado[0].pass === req.body.pass ) {
                    var diff = (fechaActual - new Date(resultado[0].codigo_validez)) / (1000 * 60 * 60);    // coeficiente de diferencia entre fechas medido en horas (ej: 1.5 significa que paso 1 hora y media)
                    if ( diff < 12 ) {
                        query = "UPDATE usuarios SET codigo = 'validado' WHERE id_usuario = " + resultado[0].id_usuario + ";";
                        f.select_a_base_de_datos(query)
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
                        query = "UPDATE usuarios SET codigo = '" + codigo + "', codigo_validez = '" + fechaCreacionCodigo + "' WHERE id_usuario = " + resultado[0].id_usuario + ";";
                        f.select_a_base_de_datos(query)
                            .then(resultado => {
                                var msg = { status: 401, msg: "no autorizado" };
                                var texto = "Bienvenido a Whales. Ingresá a http://whales.matanga.net.ar/validacion y pegá este código de validación para habilitar tu cuenta: " + codigo + ". Recordá que el código tiene validez por 12 horas.";
                                f.enviar_correo("Whales", req.body.email, "Bienvenido a Whales", texto);
                                console.log(msg);
                                res.status(201).json(msg);
                            }, err => { res.status(500).json(err); console.log(err) });
                    }
                } else {
                    var msg = { status: 401, msg: "no autorizado" };
                    console.log(msg);
                    res.status(201).json(msg);
                }
            } else if ( resultado.length === 0 ) {
                var msg = { status: 401, msg: "no autorizado" };
                console.log(msg);
                res.status(201).json(msg); 
            }
        }, err => { res.status(500).json(err); console.log(err) });
});

// PUT /usuarios/:id_usuario
app.put('/usuarios/:id_usuario', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var put_usuario = [ req.body.apellido, req.body.ciudad, req.body.direccion, req.body.dni,
                         req.body.email, req.body.id_estado, req.body.id_provincia, req.body.nombre,
                         req.body.pass, req.body.telefono, req.body.imagen, req.params.id_usuario ];
    var query = 
"UPDATE usuarios SET apellido = ?, ciudad = ?, direccion = ?, dni = ?, email = ?, \
id_estado = ?, id_provincia = ?, nombre = ?, pass = ?, telefono = ?, imagen = ? WHERE id_usuario = ?;";
    console.log("QUERY: [ " + query + " ], VARIABLES: [ " + put_usuario + " ]");
    f.select_a_base_de_datos(query, put_usuario)
        .then(resultado => {
            var msg = 
"OK: [ msg: producto modificado correctamente, affectedRows: " + resultado.affectedRows + "\
, message: " + resultado.message + " ]";
            console.log(msg);
            res.send(msg);
            }, err => console.log(err));
    f.desconectar_db();
});

// DELETE /usuarios/:id_usuario
app.delete('/usuarios/:id_usuario', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var del_usuario = parseInt(req.params.id_usuario);
    var query = "DELETE FROM usuarios WHERE id_usuario = ?;"
    console.log(query);
    f.select_a_base_de_datos(query, del_usuario)
        .then(resultado => res.send(resultado), err => console.log(err));
    f.desconectar_db();
});