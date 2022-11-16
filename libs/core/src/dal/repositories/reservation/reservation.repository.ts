import { BaseRepository } from '../base-repository';
import { ReservationEntity } from './reservation.entity';
import { Reservation } from './reservation.schema';

export class ReservationRepository extends BaseRepository<ReservationEntity> {
  constructor() {
    super(Reservation, ReservationEntity);
  }
}
