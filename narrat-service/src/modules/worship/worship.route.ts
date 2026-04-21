import { Router } from 'express';
import { WorshipController } from './worship.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

const router = Router();

router.get('/songs', asyncHandler(WorshipController.getSongs));
router.get('/songs/:id', asyncHandler(WorshipController.getSongById));
router.get('/favorites', asyncHandler(WorshipController.getFavorites));
router.post('/favorites', asyncHandler(WorshipController.addFavorite));
router.delete('/favorites/:songId', asyncHandler(WorshipController.removeFavorite));
router.get('/playlists', asyncHandler(WorshipController.getPlaylists));
router.post('/playlists', asyncHandler(WorshipController.createPlaylist));

export default router;
