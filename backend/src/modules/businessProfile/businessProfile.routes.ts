import { Router } from 'express';
import { BusinessProfileController } from './businessProfile.controller.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validate } from '../../middleware/validate.js';
import { updateBusinessProfileSchema } from './businessProfile.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', BusinessProfileController.getProfile);
router.patch('/', validate(updateBusinessProfileSchema), BusinessProfileController.updateProfile);
router.post('/signature', BusinessProfileController.updateSignature);

export default router;

