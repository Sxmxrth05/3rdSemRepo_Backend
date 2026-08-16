import { Router } from 'express';
import { InvoiceController } from './invoice.controller.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validate } from '../../middleware/validate.js';
import { createInvoiceSchema, updateInvoiceSchema, updateInvoiceStatusSchema } from './invoice.schema.js';

const router = Router();

// Unauthenticated Public Invoice View Route
router.get('/public/:shareToken', InvoiceController.getPublicInvoice);

// Authenticated Routes
router.use(requireAuth);

router.get('/trash', InvoiceController.listTrash);
router.post('/trash/empty', InvoiceController.emptyTrash);

router.post('/:id/restore', InvoiceController.restoreInvoice);
router.delete('/:id/permanent', InvoiceController.permanentDeleteInvoice);
router.post('/:id/duplicate', InvoiceController.duplicateInvoice);
router.patch('/:id/status', validate(updateInvoiceStatusSchema), InvoiceController.updateInvoiceStatus);
router.get('/:id/download', InvoiceController.downloadPdf);
router.post('/:id/send', InvoiceController.sendEmail);

router.get('/', InvoiceController.listInvoices);
router.post('/', validate(createInvoiceSchema), InvoiceController.createInvoice);
router.get('/:id', InvoiceController.getInvoiceById);
router.patch('/:id', validate(updateInvoiceSchema), InvoiceController.updateInvoice);
router.delete('/:id', InvoiceController.softDeleteInvoice);

export default router;

