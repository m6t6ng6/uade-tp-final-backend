// SOLO ENDPOINTS PARA LAS PROVINCIAS
import { Router } from 'express';
import { deleteProvinciaById, getAllProvincies, getProvinceById } from '../controllers/provincia';

const router = Router();

router.get( '/', getAllProvincies );
router.get( '/:id', getProvinceById );
router.delete( '/:id', deleteProvinciaById );

export default router;