// SOLO ENDPOINTS PARA LOS PRODUCTOS
import { Router } from 'express';
import multer from 'multer';
import { addProduct, deleteProductById, getAllProducts, getProductById, getTop1000HitsProducts, updateProductHitsById, updateProductoById } from '../controllers/producto';

//
//
// MULTER
//
// inicializacion de multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './uploads/');    // ATENCION: SIEMPRE CREAR LA CARPETA ANTES MANUALMENTE EN EL SERVIDOR !!! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !!!
  },
  filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + "_" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // acepto un archivo
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') cb(null, true);
  // rechazo un archivo
  else cb(null, false);
}
const upload = multer({ 
  storage: storage, 
  limits: {
      fileSize: 1024 * 1024 * 5    // limite de 5 megas
  },
  fileFilter: fileFilter
  });   // carpeta donde se guarda en el backend las fotos (no es publica, hay que hacerla accesible estaticamente)

//
//
//

const router = Router();

router.get( '/', getAllProducts );
router.get( '/hits', getTop1000HitsProducts );
router.get( '/:id', getProductById );
router.put( '/:id/hits', updateProductHitsById );
router.delete( '/:id', deleteProductById );
router.post( '/', upload.single('imagen'), addProduct );
router.put( '/:id', updateProductoById );

export default router;