import { BaseRepository } from '../base-repository';
import { BookEntity } from './book.entity';
import { Book } from './book.schema';

export class BookRepository extends BaseRepository<BookEntity> {
  constructor() {
    super(Book, BookEntity);
  }
}
