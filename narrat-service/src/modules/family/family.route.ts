import { Router } from 'express';
import { FamilyController } from './family.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

const router = Router();

router.get('/groups', asyncHandler(FamilyController.getGroups));
router.post('/groups', asyncHandler(FamilyController.createGroup));
router.post('/groups/:groupId/members', asyncHandler(FamilyController.addMember));
router.get('/devotions', asyncHandler(FamilyController.getDevotions));
router.get('/devotions/:id', asyncHandler(FamilyController.getDevotionById));
router.get('/topics', asyncHandler(FamilyController.getTopics));

export default router;
