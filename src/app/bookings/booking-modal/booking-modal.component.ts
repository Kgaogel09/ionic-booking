import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.scss'],
})
export class BookingModalComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('f', { static: true }) form: NgForm;
  startDate: string;
  endDate: number;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);

    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() -
              7 * 24 * 60 * 60 * 1000 -
              availableFrom.getTime())
      ).toISOString();

      this.endDate =
        new Date(this.startDate).getTime() +
        Math.random() *
          (new Date(this.startDate).getTime() +
            6 * 24 * 60 * 60 * 1000 -
            new Date(this.startDate).getTime());
    }
  }
  datesValid() {
    const startDate = new Date(this.form.value.dateFrom);
    const endDate = new Date(this.form.value.dateTo);
    return endDate > startDate;
  }

  onBookPlace() {
    if (!this.form.valid || !this.datesValid) {
      return;
    }
    this.modalCtrl.dismiss(
      {
        bookingData: {
          firstName: this.form.value.firstName,
          lastName: this.form.value.lastName,
          guestsNumber: +this.form.value.guestNumber,
          startDate: new Date(this.form.value.dateFrom),
          endDate: new Date(this.form.value.dateTo),
        },
      },
      'confirm'
    );
  }

  onClose() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
