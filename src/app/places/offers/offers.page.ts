import { PlacesService } from './../places.service';
import { Component, OnInit } from '@angular/core';
import { Place } from '../place.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  loadedOffers: Place[];

  constructor(private placeService: PlacesService) {}

  ngOnInit() {
    this.loadedOffers = this.placeService.getAllPlaces();
  }
}
