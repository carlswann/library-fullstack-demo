import { BaseRepository } from '../base-repository';
import { ShortlistedBookEntity } from './shortlisted-book.entity';
import { ShortlistedBook } from './shortlisted-book.schema';

export class ShortlistedBookRepository extends BaseRepository<ShortlistedBookEntity> {
  constructor() {
    super(ShortlistedBook, ShortlistedBookEntity);
  }
}
