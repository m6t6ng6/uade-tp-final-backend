import categoriasRoutes from './routes/categoria';
import provinciasRoutes from './routes/provincia';
import marcasRoutes from './routes/marca';
import estadosRoutes from './routes/estado';
import productosRoutes from './routes/producto';
import usuariosRoutes from './routes/usuario'; 

const router = ( app ) => {
  app.use( '/categorias', categoriasRoutes );
  app.use( '/provincias', provinciasRoutes );
  app.use( '/marcas', marcasRoutes );
  app.use( '/estados', estadosRoutes );
  app.use( '/productos', productosRoutes );
  app.use( '/usuarios', usuariosRoutes );
}

export default router;