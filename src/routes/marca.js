// SOLO ENDPOINTS PARA LAS MARCAS
import { Router } from 'express';
import { createBrand, deleteBrandById, getAllBrands, getBrandById } from '../controllers/marca';

const router = Router();

router.get( '/', getAllBrands );
router.get( '/:id', getBrandById );
router.post( '/', createBrand);
router.delete( '/:id', deleteBrandById );

export default router;