import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceDetailsPageRoutingModule } from './place-details-routing.module';

import { PlaceDetailsPage } from './place-details.page';
import { BookingModalComponent } from '../../../bookings/booking-modal/booking-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PlaceDetailsPageRoutingModule,
  ],
  declarations: [PlaceDetailsPage, BookingModalComponent],
})
export class PlaceDetailsPageModule {}
