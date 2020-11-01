$(document).ready(function(){
    // C O N T A D O R E S
    var i=0;
    //AGREGANDO CLASE ACTIVE AL PRIMER ENLACE=================

    $(".Categorias[category='todos']").addClass('active_color');

    //FILTRANDO PRODUCTOS======================================
    $(".Categorias").click(function(){
        var catProduct= $(this).attr('category');
        console.log(catProduct);

        //ASIGNANDO LA CLASE ACTIVE AL ENLACE CORRESPONDIENTE
        $(".Categorias").removeClass('active_color');
        $(this).addClass('active_color');

        //OCULTANDO PRODUCTOS=============================
        $(".producto").css('transform', 'scale(0)')
        function hideProducts (){
            $(".producto").hide();

        } setTimeout(hideProducts,400);
        //MOSTRANDO PRODUCTOS=============================
        function showProducts(){
        
        $('.'+catProduct+'').show();
        $('.'+catProduct+'').css('transform', 'scale(1)');

        } setTimeout(showProducts,400);
    });
    //MOSTRAR TODOS LOS PRODUCTOS===========================
    $(".Categorias[category='todos']").click(function(){
        function showAllProducts(){
        $(".producto").show();
        $('.producto').css('transform', 'scale(1)');
        }setTimeout(showAllProducts,400);
    });

    
 });

 window.onload = function () {
            // Variables
            let baseDeDatos = [
                {
                    id: 1,
                    nombre: 'Patata',
                    precio: 1,
                    imagen: 'https://source.unsplash.com/random/500x500/?potato&sig=1',
                    categoria: 'muebleria'
                },
                {
                    id: 2,
                    nombre: 'Cebolla',
                    precio: 1.2,
                    imagen: 'https://source.unsplash.com/random/500x500/?onion&sig=2',
                    categoria: 'indumentaria'
                },
                {
                    id: 3,
                    nombre: 'Calabacin',
                    precio: 2.1,
                    imagen: 'https://source.unsplash.com/random/500x500/?zucchini&sig=3',
                    categoria: 'perfumeria'
                },
                {
                    id: 4,
                    nombre: 'Fresas',
                    precio: 0.6,
                    imagen: 'https://source.unsplash.com/random/500x500/?burrs&sig=4',
                    categoria: 'electronica'
                }

            ]
            let $items = document.querySelector('#items');
            let carrito = [];
            let total = 0;
            let $carrito = document.querySelector('#carrito');
            let $total = document.querySelector('#total');
            let $botonVaciar = document.querySelector('#boton-vaciar');

            // Funciones
            function renderItems() {
                for (let info of baseDeDatos) {
                    // Estructura
                    let miNodo = document.createElement('div');
                    miNodo.classList.add('card', 'col-sm-4', info['categoria'], 'producto');
                    // Body
                    let miNodoCardBody = document.createElement('div');
                    miNodoCardBody.classList.add('card-body');
                    // Titulo
                    let miNodoTitle = document.createElement('h5');
                    miNodoTitle.classList.add('card-title');
                    miNodoTitle.textContent = info['nombre'];
                    //Categoria

                    // Imagen
                    let miNodoImagen = document.createElement('img');
                    miNodoImagen.classList.add('img-fluid');
                    miNodoImagen.setAttribute('src', info['imagen']);
                    // Precio
                    let miNodoPrecio = document.createElement('p');
                    miNodoPrecio.classList.add('card-text');
                    miNodoPrecio.textContent = info['precio'] + '€';
                    // Boton 
                    let miNodoBoton = document.createElement('button');
                    miNodoBoton.classList.add('btn', 'btn-primary');
                    miNodoBoton.textContent = '+';
                    miNodoBoton.setAttribute('marcador', info['id']);
                    miNodoBoton.addEventListener('click', anyadirCarrito);
                    // Insertamos
                    miNodoCardBody.appendChild(miNodoImagen);
                    miNodoCardBody.appendChild(miNodoTitle);
                    miNodoCardBody.appendChild(miNodoPrecio);
                    miNodoCardBody.appendChild(miNodoBoton);
                    miNodo.appendChild(miNodoCardBody);
                    $items.appendChild(miNodo);
                }
            }

            function anyadirCarrito () {
                // Anyadimos el Nodo a nuestro carrito
                carrito.push(this.getAttribute('marcador'))
                // Calculo el total
                calcularTotal();
                // Renderizamos el carrito 
                renderizarCarrito();
            }

            function renderizarCarrito() {
                // Vaciamos todo el html
                $carrito.textContent = '';
                // Quitamos los duplicados
                let carritoSinDuplicados = [...new Set(carrito)];
                // Generamos los Nodos a partir de carrito
                carritoSinDuplicados.forEach(function (item, indice) {
                    // Obtenemos el item que necesitamos de la variable base de datos
                    let miItem = baseDeDatos.filter(function(itemBaseDatos) {
                        return itemBaseDatos['id'] == item;
                    });
                    // Cuenta el número de veces que se repite el producto
                    let numeroUnidadesItem = carrito.reduce(function (total, itemId) {
                        return itemId === item ? total += 1 : total;
                    }, 0);
                    // Creamos el nodo del item del carrito
                    let miNodo = document.createElement('li');
                    miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
                    miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0]['nombre']} - ${miItem[0]['precio']}€`;
                    // Boton de borrar
                    let miBoton = document.createElement('button');
                    miBoton.classList.add('btn', 'btn-danger', 'mx-5');
                    miBoton.textContent = 'X';
                    miBoton.style.marginLeft = '1rem';
                    miBoton.setAttribute('item', item);
                    miBoton.addEventListener('click', borrarItemCarrito);
                    // Mezclamos nodos
                    miNodo.appendChild(miBoton);
                    $carrito.appendChild(miNodo);
                })
            }

            function borrarItemCarrito() {
                console.log()
                // Obtenemos el producto ID que hay en el boton pulsado
                let id = this.getAttribute('item');
                // Borramos todos los productos
                carrito = carrito.filter(function (carritoId) {
                    return carritoId !== id;
                });
                // volvemos a renderizar
                renderizarCarrito();
                // Calculamos de nuevo el precio
                calcularTotal();
            }

            function calcularTotal() {
                // Limpiamos precio anterior
                total = 0;
                // Recorremos el array del carrito
                for (let item of carrito) {
                    // De cada elemento obtenemos su precio
                    let miItem = baseDeDatos.filter(function(itemBaseDatos) {
                        return itemBaseDatos['id'] == item;
                    });
                    total = total + miItem[0]['precio'];
                }
                // Formateamos el total para que solo tenga dos decimales
                let totalDosDecimales = total.toFixed(2);
                // Renderizamos el precio en el HTML
                $total.textContent = totalDosDecimales;
            }

            function vaciarCarrito() {
                // Limpiamos los productos guardados
                carrito = [];
                // Renderizamos los cambios
                renderizarCarrito();
                calcularTotal();
            }

            // Eventos
            $botonVaciar.addEventListener('click', vaciarCarrito);

            // Inicio
            renderItems();
        } 