import { Controller, UseGuards } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { BookEntity } from '@nest-starter/core';
import { BooksService } from './books.service';
import { AuthGuard } from '@nestjs/passport';

@Crud({
  model: {
    type: BookEntity,
  },
  params: {
    id: {
      type: 'string',
      primary: true,
      field: 'id',
    },
  },
})
@UseGuards(AuthGuard('jwt'))
@Controller('/admin/entities/books')
export class BooksController {
  constructor(public service: BooksService) {}
}
