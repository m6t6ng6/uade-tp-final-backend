// SOLO ENDPOINTS PARA LAS CATEGORIAS
import { Router } from 'express';
import { createCategory, deleteCategoryById, getAllCategories, getCategoryById } from '../controllers/categoria';

const router = Router();

router.get( '/', getAllCategories );
router.get( '/:id', getCategoryById );
router.post( '/', createCategory );
router.delete( '/:id', deleteCategoryById );

export default router;