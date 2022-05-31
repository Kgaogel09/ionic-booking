import { PlacesService } from './../places.service';
import { Component, OnInit } from '@angular/core';
import { Place } from '../place.model';
import {
  AlertController,
  IonItemSliding,
  MenuController,
  NavController,
} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  loadedOffers: Place[];
  filteredOffers: Place;

  constructor(
    private placeService: PlacesService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadedOffers = this.placeService.getAllPlaces();
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
