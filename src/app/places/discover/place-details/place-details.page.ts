import { Subscription } from 'rxjs';
import { BookingModalComponent } from './../../../bookings/booking-modal/booking-modal.component';
import { PlacesService } from './../../places.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from '../../place.model';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { BookingsService } from '../../../bookings/bookings.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.page.html',
  styleUrls: ['./place-details.page.scss'],
})
export class PlaceDetailsPage implements OnInit, OnDestroy {
  loadedPlace: Place;
  isBookable = false;
  isLoading = false;
  private placeSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private placeService: PlacesService,
    private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingsService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        //redirect
        this.router.navigate(['/places/tabs/discover']);
        return;
      }
      const placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placeSub = this.placeService.getPlace(placeId).subscribe(
        (place) => {
          this.loadedPlace = place;
          this.isBookable = place.userId !== this.authService.userId;
          this.isLoading = false;
        },
        (error) => {
          this.alertCtrl
            .create({
              header: 'An error occurred',
              message: 'Places could not be found',
              buttons: [
                {
                  text: 'okay',
                  handler: () => {
                    this.router.navigateByUrl('/places/tabs/discover');
                  },
                },
              ],
            })
            .then((alertEl) => {
              alertEl.present();
            });
        }
      );
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onBookPlace() {
    this.router.navigateByUrl('/places/tabs/discover');
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
        componentProps: { selectedPlace: this.loadedPlace, selectedMode: mode },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultsData) => {
        console.log(resultsData.data, resultsData.role);
        if (resultsData.role === 'confirm') {
          this.loadingCtrl
            .create({
              message: 'Creating booking...',
            })
            .then((loadingEl) => {
              loadingEl.present();
              const data = resultsData.data.bookingData;
              this.bookingService
                .addBooking(
                  Math.random().toString(),
                  this.authService.userId,
                  this.loadedPlace.id,
                  this.loadedPlace.title,
                  this.loadedPlace.imgUrl,
                  data.firstName,
                  data.lastName,
                  data.guestsNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                  this.navCtrl.navigateForward(['/bookings']);
                });
            });
        }
      });
  }
}
