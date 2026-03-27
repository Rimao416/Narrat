import { Router } from 'express';
import { EvangelismController } from './evangelism.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

const router = Router();

router.get('/contacts', asyncHandler(EvangelismController.getContacts));
router.post('/contacts', asyncHandler(EvangelismController.createContact));
router.put('/contacts/:id/status', asyncHandler(EvangelismController.updateContactStatus));
router.delete('/contacts/:id', asyncHandler(EvangelismController.deleteContact));
router.get('/resources', asyncHandler(EvangelismController.getResources));
router.get('/objections', asyncHandler(EvangelismController.getObjectionAnswers));

export default router;
