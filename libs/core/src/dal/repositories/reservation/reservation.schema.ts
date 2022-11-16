import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { ReservationEntity } from './reservation.entity';

const reservationSchema = new Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  startsAt: mongoose.Schema.Types.Date,
  endsAt: mongoose.Schema.Types.Date,
}, schemaOptions);

export interface IReservationDocument extends ReservationEntity, Document {
  _id: string;
}

export const Reservation = mongoose.models.Reservation || mongoose.model<IReservationDocument>('Reservation', reservationSchema);
