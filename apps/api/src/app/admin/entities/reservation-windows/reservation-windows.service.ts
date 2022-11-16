import { Injectable } from '@nestjs/common';
import { ReservationEntity, ReservationRepository } from '@nest-starter/core';
import { MongooseCrudService } from '../../../shared/crud/mongoose-crud.service';

@Injectable()
export class ReservationsWindowsService extends MongooseCrudService<ReservationEntity> {
  constructor(private reservationsRepository: ReservationRepository) {
    super(reservationsRepository._model);
  }
}
