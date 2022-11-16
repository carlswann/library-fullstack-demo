import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, CrudRequest, Override, ParsedRequest } from '@nestjsx/crud';
import { ShortlistedBookEntity } from '@nest-starter/core';
import { ShortlistedBooksService } from './shortlisted-books.service';
import { AuthGuard } from '@nestjs/passport';

@Crud({
  model: {
    type: ShortlistedBookEntity,
  },
  params: {
    id: {
      type: 'string',
      primary: true,
      field: 'id',
    },
  },
})
@CrudAuth({
  property: 'user',
  filter: (user) => ({ user: user._id }),
  persist: (user) => {
    return ({ user: user._id });
  },
})
@UseGuards(AuthGuard('jwt'))
@Controller('/admin/entities/shortlisted-books')
export class ShortlistedBooksController {
  constructor(public service: ShortlistedBooksService) {}
  
  get base(): CrudController<ShortlistedBookEntity> {
    return this;
  }

  @Override('getManyBase')
  async getMany(
    @ParsedRequest() req: CrudRequest,
  ) {
    if (!req.parsed.join.length) {
      req.parsed.join.push({ field: 'book' });
    }

    return this.base.getManyBase(req);
  }
}