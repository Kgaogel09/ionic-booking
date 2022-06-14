import { PlacesService } from './../places.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Place } from '../place.model';
import {
  AlertController,
  IonItemSliding,
  LoadingController,
  MenuController,
  NavController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  loadedOffers: Place[];
  isLoading = false;
  private placesSub: Subscription;

  constructor(
    private placeService: PlacesService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.placesSub = this.placeService.placesList.subscribe((placesList) => {
      this.loadedOffers = placesList;
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.isLoading = true;
    if (this.isLoading) {
      this.loadingCtrl
        .create({
          message: 'Loading',
        })
        .then((loadingEl) => {
          loadingEl.present();
        });
    }
    this.placeService.fetchAllPlaces().subscribe(() => {
      this.isLoading = false;
      this.loadingCtrl.dismiss();
    });
  }

  onAdd() {
    this.navCtrl.navigateForward('/places/tabs/offers/new');
  }

  deleteOffer(offerId: string) {
    this.loadedOffers = this.loadedOffers.filter(
      (offer) => offer.id !== offerId
    );
  }

  onEdit(slidingItem: IonItemSliding) {
    slidingItem.close();
  }

  onDelete(offerId: string) {
    this.alertCtrl
      .create({
        header: 'Are you sure?',
        message: 'Do you really want to delete this recipe?',
        buttons: [
          { text: 'Cancel', role: 'Cancel' },
          {
            text: 'Delete',
            handler: () => {
              this.deleteOffer(offerId);
              console.log(offerId);
              this.router.navigate(['places/tabs/offers']);
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
