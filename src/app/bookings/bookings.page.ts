import { IonItemSliding } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Bookings } from './bookings.model';
import { BookingsService } from './bookings.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBookings: Bookings[];

  constructor(private bookingService: BookingsService) {}

  ngOnInit() {
    this.loadedBookings = this.bookingService.bookings;
  }

  onDelete(bookingId: string, slidingEl: IonItemSliding) {
    // this.loadedBookings = this.loadedBookings.filter(
    //   (booking) => booking.id !== bookingId
    // );
    slidingEl.close();
  }
}
