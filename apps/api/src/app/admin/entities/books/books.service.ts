import { Injectable } from '@nestjs/common';
import { BookEntity, BookRepository } from '@nest-starter/core';
import { MongooseCrudService } from '../../../shared/crud/mongoose-crud.service';

@Injectable()
export class BooksService extends MongooseCrudService<BookEntity> {
  constructor(private repository: BookRepository) {
    super(repository._model);
  }
}
