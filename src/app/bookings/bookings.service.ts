import { HttpClient } from '@angular/common/http';
/* eslint-disable no-underscore-dangle */
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Booking } from './bookings.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get bookings() {
    return this._bookings.asObservable();
  }

  addBooking(
    id: string,
    placeId: string,
    userId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );
    return this.http
      .post<{ name: string }>(
        'https://bookings-62ee4-default-rtdb.firebaseio.com/bookings.json',
        { ...newBooking, id: null }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          newBooking.id = generatedId;
          this._bookings.next(bookings.concat(newBooking));
        })
      );
    // return this.bookings.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((bookings) => {
    //     this._bookings.next(bookings.concat(newBooking));
    //   })
    // );
  }

  cancelBooking(bookingId: string) {
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap((bookings) => {
        this._bookings.next(
          bookings.filter((booking) => booking.id !== bookingId)
        );
      })
    );
  }
}
