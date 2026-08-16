import { Router } from 'express';
import { UserController } from './user.controller.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validate } from '../../middleware/validate.js';
import { updateUserProfileSchema, changePasswordSchema } from './user.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/me', UserController.getMe);
router.patch('/me', validate(updateUserProfileSchema), UserController.updateMe);
router.delete('/me', UserController.deleteAccount);
router.post('/change-password', validate(changePasswordSchema), UserController.changePassword);

export default router;

