import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { CartController } from '../controllers/cart.controller.js';

const router = Router();

router.get('/', authenticate, CartController.getCart);
router.post('/', authenticate, CartController.addToCart);
router.put('/:id', authenticate, CartController.updateCartItem);
router.delete('/:id', authenticate, CartController.deleteCartItem);

export default router;
