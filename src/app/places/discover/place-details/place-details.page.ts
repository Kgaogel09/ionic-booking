import { BookingModalComponent } from './../../../bookings/booking-modal/booking-modal.component';
import { PlacesService } from './../../places.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from '../../place.model';
import {
  ActionSheetController,
  ModalController,
  NavController,
} from '@ionic/angular';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.page.html',
  styleUrls: ['./place-details.page.scss'],
})
export class PlaceDetailsPage implements OnInit {
  loadedPlace: Place;

  constructor(
    private activatedRoute: ActivatedRoute,
    private placeService: PlacesService,
    private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        //redirect
        this.router.navigate(['/places/tabs/discover']);
        return;
      }
      const placeId = paramMap.get('placeId');
      this.loadedPlace = this.placeService.getPlace(placeId);
    });
  }

  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover');
    this.actionSheetCtrl
      .create({
        header: 'Choose an action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
            },
          },
          {
            text: 'Cancel',
            role: 'destructive',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }
  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: BookingModalComponent,
        componentProps: { selectedPlace: this.loadedPlace },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultsData) => {
        // alert(resultsData.data);
        if (resultsData.role === 'confirm') {
          alert(`BOOKED!🔖`);
        }
      });
  }
}
