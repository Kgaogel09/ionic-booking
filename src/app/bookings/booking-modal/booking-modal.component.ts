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
  form: FormGroup;
  dateValue2 = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      date: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
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

  formatDate(value: string) {
    // return format(parseISO(value), 'MMM dd yyyy');
  }
}
