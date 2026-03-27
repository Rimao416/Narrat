import { Router } from 'express';
import { LibraryController } from './library.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

const router = Router();

router.get('/books', asyncHandler(LibraryController.getBooks));
router.get('/books/:slug', asyncHandler(LibraryController.getBook));
router.get('/categories', asyncHandler(LibraryController.getCategories));

export default router;
