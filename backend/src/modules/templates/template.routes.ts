import { Router } from 'express';
import { TemplateController } from './template.controller.js';

const router = Router();

router.get('/', TemplateController.listTemplates);
router.get('/:slug', TemplateController.getTemplateBySlug);

export default router;

