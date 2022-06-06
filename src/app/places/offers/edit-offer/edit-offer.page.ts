import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  loadedOffer: Place;
  form: FormGroup;

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
        this.navCtrl.navigateBack(['/places/tabs/discover']);
        return;
      }
      const placeId = paramMap.get('placeId');
      this.loadedOffer = this.placeService.getPlace(placeId);
      this.form = new FormGroup({
        title: new FormControl(this.loadedOffer.title, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        description: new FormControl(this.loadedOffer.description, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(100)],
        }),
      });
    });
  }

  onEditOffer() {
    if (!this.form.valid) {
      return;
    } else {
      console.log(this.form.value);
      this.navCtrl.navigateBack(['/places/tabs/offers']);
      return;
    }
  }
}
