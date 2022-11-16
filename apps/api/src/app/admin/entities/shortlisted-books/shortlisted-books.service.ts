import { Injectable } from '@nestjs/common';
import { ShortlistedBookEntity, ShortlistedBookRepository } from '@nest-starter/core';
import { MongooseCrudService } from '../../../shared/crud/mongoose-crud.service';

@Injectable()
export class ShortlistedBooksService extends MongooseCrudService<ShortlistedBookEntity> {
  constructor(private repository: ShortlistedBookRepository) {
    super(repository._model);
  }
}
