import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createAddressSchema, deleteAddressSchema, updateAddressSchema } from '../validators/address.validator.js';
import { AddressController } from '../controllers/address.controller.js';

const router = Router();

router.get('/', authenticate, AddressController.getAllAddress);
router.post('/', authenticate, validate(createAddressSchema), AddressController.create);
router.put('/:id', authenticate, validate(updateAddressSchema), AddressController.update);
router.delete('/:id', authenticate, validate(deleteAddressSchema), AddressController.delete);

export default router;
