import * as dayjs from 'dayjs'
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {  CrudController } from '@nestjsx/crud';
import { ReservationEntity } from '@nest-starter/core';
import { ReservationsWindowsService } from './reservation-windows.service';
import { AuthGuard } from '@nestjs/passport';


@UseGuards(AuthGuard('jwt'))
@Controller('/admin/entities/reservation-windows')
export class ReservationsWindowsController {
  constructor(
    public service: ReservationsWindowsService,
  ) {}

  get base(): CrudController<ReservationEntity> {
    return this;
  }

  /**
   * Returns the first 7 days that are free for the given book to be reserved
   * 
   * @param bookId 
   * @returns 
   */
  @Get(':bookId')
  async getMany(@Param('bookId') bookId: string) {
    const existingReservations = await this.service.model.find({
      book: bookId,
      endsAt: {"$gte": new Date() },
    }, 
    undefined, 
    {
      sort: {
        startsAt: 'ASC'
      }
    })

    let currentDate = dayjs().startOf('day');
    const reservationWindows = []
    while (reservationWindows.length < 7) {
      if (this.isDateFree(currentDate, existingReservations)) {
        reservationWindows.push({ 
          id: currentDate.toDate().getTime(),
          startsAt: currentDate, 
          endsAt: currentDate 
        });
      }

      currentDate = currentDate.add(1, 'day');
    }

    return { data: reservationWindows }
  }

  isDateFree(date: dayjs.Dayjs, existingReservations: ReservationEntity[]) {
    for (const reservation of existingReservations) {
      const startDateOverlaps = date.toDate() >= new Date(reservation.startsAt)
      const endDateOverlaps =  date.toDate() <= new Date(reservation.endsAt)

      if (startDateOverlaps && endDateOverlaps) {
        return false
      }
    }

    return true;
  }
}
