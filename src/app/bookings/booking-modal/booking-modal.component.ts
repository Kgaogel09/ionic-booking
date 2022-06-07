import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
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

  onBookPlace() {
    this.modalCtrl.dismiss(
      'Are you sure you want to book this place?',
      'confirm'
    );
  }

  onClose() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
