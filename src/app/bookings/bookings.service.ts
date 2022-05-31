/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Bookings } from './bookings.model';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private _bookings: Bookings[] = [
    {
      id: 'b1',
      placeId: 'p1',
      placeTitle: 'Manhattan Mansion',
      userId: 'u1',
      guestNumber: 2,
    },
    {
      id: 'b2',
      placeId: 'p2',
      placeTitle: 'Bonsoir',
      userId: 'u2',
      guestNumber: 1,
    },
  ];

  constructor() {}

  get bookings() {
    return [...this._bookings];
  }
}
