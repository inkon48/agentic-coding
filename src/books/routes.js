import { Router } from 'express';
import { NotFoundError } from '../middlewares/error.js';
import { validateBookBody, validateBookId } from './validation.js';

/**
 * Self-contained /books router wired to an injected repository.
 * All handlers are async; Express 5 forwards rejected promises to the error
 * middleware, so async capability is first-class here.
 */
export function createBooksRouter(repository) {
  const router = Router();

  // GET /books — list all (optionally filtered by ?title= / ?author=)
  router.get('/', async (req, res) => {
    const { title, author } = req.query;
    const books = await repository.list({ title, author });
    res.json(books);
  });

  // GET /books/:id — get one book
  router.get('/:id', validateBookId, async (req, res) => {
    const book = await repository.getById(req.params.id);
    if (!book) throw new NotFoundError('Book not found');
    res.json(book);
  });

  // POST /books — add a book
  router.post('/', validateBookBody, async (req, res) => {
    const book = await repository.create(req.body);
    res.status(201).json(book);
  });

  // PUT /books/:id — update a book
  router.put('/:id', validateBookId, validateBookBody, async (req, res) => {
    const book = await repository.update(req.params.id, req.body);
    if (!book) throw new NotFoundError('Book not found');
    res.json(book);
  });

  // DELETE /books/:id — delete a book
  router.delete('/:id', validateBookId, async (req, res) => {
    const deleted = await repository.delete(req.params.id);
    if (!deleted) throw new NotFoundError('Book not found');
    res.status(204).end();
  });

  return router;
}