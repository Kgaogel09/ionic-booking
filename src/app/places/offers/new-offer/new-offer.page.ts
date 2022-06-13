import { PlacesService } from './../../places.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  constructor(
    private placeService: PlacesService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      date: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
  }

  onCreateOffer() {
    if (!this.form) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Creating Place...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.placeService
          .addPlace({
            title: this.form.value.title,
            description: this.form.value.description,
            price: +this.form.value.price,
            dateFrom: new Date(this.form.value.date),
            dateTo: new Date(this.form.value.dateTo),
          })
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.navCtrl.navigateBack(['/places/tabs/discover']);
          });
      });
  }
}
