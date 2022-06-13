/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public placesList = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York',
      'https://static2.mansionglobal.com/production/media/article-images/2f6a5dc3d80ef19f3bc23ddc1e911adf/large_Screen-Shot-2017-12-07-at-12.11.10-PM.png',
      150.99,
      new Date(Date.now()),
      new Date(Date.now()),
      'u1'
    ),
    new Place(
      'p2',
      'Bonsoir',
      'A romantic place Paris',
      'https://i.pinimg.com/736x/6e/12/a3/6e12a3c9d28b00988370e1c646ad2d7a.jpg',
      220.99,
      new Date(Date.now()),
      new Date(Date.now()),
      'u1'
    ),
    new Place(
      'p3',
      'The Foggy Place',
      'Not your average city trip',
      'https://s3.envato.com/files/123e6f49-8572-4e47-bef5-ac691abed4e2/inline_image_preview.jpg',
      90.99,
      new Date(Date.now()),
      new Date(Date.now()),
      'u1'
    ),
  ]);

  constructor(private authService: AuthService) {}

  getAllPlaces() {
    return this.placesList.asObservable();
  }

  getPlace(placeId: string) {
    return this.placesList.pipe(
      take(1),
      map((placesList) => ({ ...placesList.find((p) => p.id === placeId) }))
    );
  }

  addPlace({
    title,
    description,
    price,
    dateFrom,
    dateTo,
  }: {
    title: string;
    description: string;
    price: number;
    dateFrom: Date;
    dateTo: Date;
  }) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://images.unsplash.com/photo-1610036615775-f5814e8bd4df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.placesList.pipe(
      take(1),
      delay(2000),
      tap((placeList) => {
        this.placesList.next(placeList.concat(newPlace));
      })
    );
  }

  updateOffer(placeId: string, title: string, description: string) {
    return this.placesList.pipe(
      take(1),
      delay(2000),
      tap((placesList) => {
        const updatedPlaceIndex = placesList.findIndex(
          (pl) => pl.id === placeId
        );
        const updatedPlaces = [...placesList];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imgUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this.placesList.next(updatedPlaces);
      })
    );
  }
}
