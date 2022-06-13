import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  bookablePlaces: Place[];
  private placesSub: Subscription;

  constructor(
    private placeService: PlacesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.placesSub = this.placeService.placesList.subscribe((placesList) => {
      this.loadedPlaces = placesList;
      this.bookablePlaces = this.loadedPlaces;

      this.listedLoadedPlaces = this.bookablePlaces.slice(1);
    });
  }
  ngOnDestroy() {
    if (this.loadedPlaces) {
      this.placesSub.unsubscribe();
    }
  }

  onFilter(event: CustomEvent<SegmentChangeEventDetail>) {
    // console.log('event', event.detail);
    if (event.detail.value === 'all-places') {
      this.bookablePlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.bookablePlaces.slice(1);
    } else {
      this.bookablePlaces = this.loadedPlaces.filter(
        (place) => place.userId !== this.authService.userId
      );
      this.listedLoadedPlaces = this.bookablePlaces.slice(1);
    }
  }
}
