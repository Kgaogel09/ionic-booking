import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {
  loadedPlace: Place;
  constructor(
    private activatedRoute: ActivatedRoute,
    private placeService: PlacesService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        //redirect
        // this.router.navigate(['/places/tabs/offers']);
        this.navCtrl.navigateBack(['/places/tabs/offers']);
        return;
      }
      const placeId = paramMap.get('placeId');
      this.loadedPlace = this.placeService.getPlace(placeId);
    });
  }
}
