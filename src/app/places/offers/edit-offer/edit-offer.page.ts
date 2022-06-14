import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  loadedOffer: Place;
  form: FormGroup;
  isLoading = false;
  private placeSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private placeService: PlacesService,
    private router: Router,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        //redirect
        this.navCtrl.navigateBack(['/places/tabs/offers']);
        return;
      }
      const placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placeSub = this.placeService.getPlace(placeId).subscribe((place) => {
        this.loadedOffer = place;
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
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onEditOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Editing Offer...',
      })
      .then((loadingEl) => {
        loadingEl.present();
      });
    console.log(this.form.value);
    this.placeService
      .updateOffer(
        this.loadedOffer.id,
        this.form.value.title,
        this.form.value.description
      )
      .subscribe(() => {
        this.loadingCtrl.dismiss();
        this.form.reset();
        this.navCtrl.navigateBack(['/places/tabs/offers']);
      });
  }
}
