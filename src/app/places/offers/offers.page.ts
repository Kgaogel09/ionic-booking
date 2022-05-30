import { PlacesService } from './../places.service';
import { Component, OnInit } from '@angular/core';
import { Place } from '../place.model';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  loadedOffers: Place[];

  constructor(
    private placeService: PlacesService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadedOffers = this.placeService.getAllPlaces();
  }

  onAdd() {
    this.navCtrl.navigateForward('/places/tabs/offers/new');
  }
}
