// SOLO ENDPOINTS PARA LAS MARCAS
import { Router } from 'express';
import { getAllStatuses } from '../controllers/estado';

const router = Router();

router.get( '/', getAllStatuses );

export default router;