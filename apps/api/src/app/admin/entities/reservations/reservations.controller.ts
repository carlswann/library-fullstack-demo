import { BadRequestException, Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { ReservationEntity } from '@nest-starter/core';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from '@nestjs/passport';

@Crud({
  model: {
    type: ReservationEntity,
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
@Controller('/admin/entities/reservations')
export class ReservationsController {
  constructor(public service: ReservationsService) {}

  get base(): CrudController<ReservationEntity> {
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

  @Override('createOneBase')
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: ReservationEntity,
  ) {
    const overlappingReservation = await this.service.model.findOne({
      book: dto.book,
      startsAt: {"$lt": dto.endsAt }, 
      endsAt: {"$gt": dto.startsAt }
    })

    if (overlappingReservation) {
      throw new BadRequestException('A reservation already exists for this date');
    }

    return this.base.createOneBase(req, dto);
  }
}
