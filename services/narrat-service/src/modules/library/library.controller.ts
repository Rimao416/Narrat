import { Request, Response } from 'express';
import { LibraryService } from './library.service';

export class LibraryController {
  static async getBooks(req: Request, res: Response) {
    const { category } = req.query;
    const books = await LibraryService.getBooks(category as string);
    res.status(200).json(books);
  }

  static async getBook(req: Request, res: Response) {
    const { slug } = req.params;
    const book = await LibraryService.getBookBySlug(slug);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  }

  static async getCategories(req: Request, res: Response) {
    const categories = await LibraryService.getCategories();
    res.status(200).json(categories);
  }
}
