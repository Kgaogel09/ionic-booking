import { Component, OnInit } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  constructor(private placeService: PlacesService) {}

  ngOnInit() {
    this.loadedPlaces = this.placeService.getAllPlaces();
    this.listedLoadedPlaces = this.loadedPlaces.slice(1);
  }

  onFilter(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log('event', event.detail);
  }
}
