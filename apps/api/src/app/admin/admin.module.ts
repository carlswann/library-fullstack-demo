import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { BooksController } from './entities/books/books.controller';
import { ReservationsController } from './entities/reservations/reservations.controller';
import { ShortlistedBooksController } from './entities/shortlisted-books/shortlisted-books.controller';
import { BooksService } from './entities/books/books.service';
import { ReservationsService } from './entities/reservations/reservations.service';
import { ShortlistedBooksService } from './entities/shortlisted-books/shortlisted-books.service';
import { UsersController } from './entities/users/users.controller';
import { UsersService } from './entities/users/users.service';
import { ReservationsWindowsController } from './entities/reservation-windows/reservation-windows.controller';
import { ReservationsWindowsService } from './entities/reservation-windows/reservation-windows.service';

@Module({
  imports: [SharedModule],
  controllers: [UsersController, BooksController, ReservationsController, ShortlistedBooksController, ReservationsWindowsController],
  providers: [UsersService, BooksService, ReservationsService, ShortlistedBooksService, ReservationsWindowsService],
})
export class AdminModule {}
