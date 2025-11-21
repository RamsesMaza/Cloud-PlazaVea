import { Router } from 'express';
import { getRequests, createRequest } from '../controllers/requestController';

const router = Router();

router.get('/', getRequests);
router.post('/', createRequest);

export default router;