import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NavController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  loadedOffer: Place;
  // form: FormGroup;
  form: FormGroup;
  placeId: string;
  isLoading = false;
  private placeSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private placeService: PlacesService,
    private router: Router,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placeSub = this.placeService
        .getPlace(paramMap.get('placeId'))
        .subscribe(
          (place) => {
            this.loadedOffer = place;
            this.form = new FormGroup({
              title: new FormControl(this.loadedOffer.title, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              description: new FormControl(this.loadedOffer.description, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)],
              }),
            });
            this.isLoading = false;
          },
          (error) => {
            this.alertCtrl
              .create({
                header: 'An error occurred!',
                message: 'Place could not be fetched. Please try again later.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/places/tabs/offers']);
                    },
                  },
                ],
              })
              .then((alertEl) => {
                alertEl.present();
              });
          }
        );
    });
  }

  onEditOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating place...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.placeService
          .updateOffer(
            this.loadedOffer.id,
            this.form.value.title,
            this.form.value.description
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }

  // onEditOffer() {
  //   if (!this.form.valid) {
  //     return;
  //   }
  //   this.loadingCtrl
  //     .create({
  //       message: 'Editing Offer...',
  //     })
  //     .then((loadingEl) => {
  //       loadingEl.present();
  //       this.placeService
  //         .updateOffer(
  //           this.loadedOffer.id,
  //           this.form.value.title,
  //           this.form.value.description
  //         )
  //         .subscribe(() => {
  //           this.loadingCtrl.dismiss();
  //           this.form.reset();
  //           this.navCtrl.navigateBack(['/places/tabs/offers']);
  //         });
  //     });
  // }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
