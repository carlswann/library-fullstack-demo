import type { BookEntity } from "../book/book.entity";
import type { UserEntity } from "../user/user.entity";

export class ShortlistedBookEntity {
  _id: string;
  book: BookEntity | string;
  user: UserEntity | string;
}
