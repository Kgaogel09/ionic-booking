import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  private placesSub: Subscription;

  constructor(private placeService: PlacesService) {}

  ngOnInit() {
    this.placesSub = this.placeService.placesList.subscribe((placesList) => {
      this.loadedPlaces = placesList;

      this.listedLoadedPlaces = this.loadedPlaces.slice(1);
    });
  }
  ngOnDestroy() {
    if (this.loadedPlaces) {
      this.placesSub.unsubscribe();
    }
  }

  onFilter(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log('event', event.detail);
  }
}
