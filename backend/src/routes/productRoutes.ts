import { Router } from 'express';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
