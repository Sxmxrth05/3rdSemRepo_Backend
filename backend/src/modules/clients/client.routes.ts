import { Router } from 'express';
import { ClientController } from './client.controller.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validate } from '../../middleware/validate.js';
import { createClientSchema, updateClientSchema } from './client.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', ClientController.listClients);
router.post('/', validate(createClientSchema), ClientController.createClient);
router.get('/:id', ClientController.getClientById);
router.get('/:id/invoices', ClientController.getClientInvoices);
router.patch('/:id', validate(updateClientSchema), ClientController.updateClient);
router.post('/:id/unarchive', ClientController.unarchiveClient);
router.delete('/:id', ClientController.archiveClient);

export default router;

