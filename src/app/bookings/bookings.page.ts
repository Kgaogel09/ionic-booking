import { Subscription } from 'rxjs';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from './bookings.model';
import { BookingsService } from './bookings.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private bookingSub: Subscription;

  constructor(
    private bookingService: BookingsService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    // this.loadedBookings = this.bookingService.bookings;
    this.bookingSub = this.bookingService.bookings.subscribe((bookings) => {
      this.loadedBookings = bookings;
    });
  }

  ngOnDestroy(): void {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

  onDelete(bookingId: string, slidingEl: IonItemSliding) {
    // this.loadedBookings = this.loadedBookings.filter(
    //   (booking) => booking.id !== bookingId
    // );
    slidingEl.close();
    this.loadingCtrl
      .create({
        message: 'Deleting booking...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.bookingService.cancelBooking(bookingId).subscribe(() => {
          loadingEl.dismiss();
        });
      });
  }
}
