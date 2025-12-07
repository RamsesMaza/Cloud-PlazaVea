import { Router } from 'express';
import { getSuppliers, addSupplier, deleteSupplier } from '../controllers/supplierController'; // <-- Importar addSupplier

const router = Router();

router.get('/', getSuppliers);
router.post('/', addSupplier);
router.delete('/:id', deleteSupplier); // <-- AGREGAR RUTA POST

export default router;