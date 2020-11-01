// SOLO ENDPOINTS PARA LAS CATEGORIAS
import { Router } from 'express';
import { getAllCategories, getCategoryById } from '../controllers/categoria';

const router = Router();

router.get( '/', getAllCategories );
router.get( '/:id', getCategoryById );

export default router;