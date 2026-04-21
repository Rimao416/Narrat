import { Router } from 'express';
import { PrayerController } from './prayer.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

const router = Router();

// Journal
router.get('/journal', asyncHandler(PrayerController.getJournal));
router.post('/journal', asyncHandler(PrayerController.addJournalEntry));
router.put('/journal/:id', asyncHandler(PrayerController.updateJournalEntry));

// Prayer Wall (Mur d'intercession)
router.get('/requests', asyncHandler(PrayerController.getPrayerRequests));
router.post('/requests', asyncHandler(PrayerController.createPrayerRequest));
router.post('/requests/:id/pray', asyncHandler(PrayerController.prayForRequest));
router.put('/requests/:id/answered', asyncHandler(PrayerController.markAnswered));

export default router;
