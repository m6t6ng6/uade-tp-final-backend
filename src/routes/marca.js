// SOLO ENDPOINTS PARA LAS MARCAS
import { Router } from 'express';
import { deleteBrandById, getAllBrands, getBrandById } from '../controllers/marca';

const router = Router();

router.get( '/', getAllBrands );
router.get( '/:id', getBrandById );
router.delete( '/:id', deleteBrandById );

export default router;