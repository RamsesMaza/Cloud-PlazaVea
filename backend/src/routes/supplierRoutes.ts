import { Router } from 'express';
import { getSuppliers, addSupplier } from '../controllers/supplierController'; // <-- Importar addSupplier

const router = Router();

router.get('/', getSuppliers);
router.post('/', addSupplier); // <-- AGREGAR RUTA POST

export default router;