import { Router } from 'express';
import { getMovements, addMovement } from '../controllers/movementController';

const router = Router();

router.get('/', getMovements);
router.post('/', addMovement);

export default router;