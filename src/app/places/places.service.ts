/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imgUrl: string;
  price: number;
  title: string;
  userId: string;
}
@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  // public placesList = new BehaviorSubject<Place[]>([
  //   new Place(
  //     'p1',
  //     'Manhattan Mansion',
  //     'In the heart of New York',
  //     'https://static2.mansionglobal.com/production/media/article-images/2f6a5dc3d80ef19f3bc23ddc1e911adf/large_Screen-Shot-2017-12-07-at-12.11.10-PM.png',
  //     150.99,
  //     new Date(Date.now()),
  //     new Date(Date.now()),
  //     'u1'
  //   ),
  //   new Place(
  //     'p2',
  //     'Bonsoir',
  //     'A romantic place Paris',
  //     'https://i.pinimg.com/736x/6e/12/a3/6e12a3c9d28b00988370e1c646ad2d7a.jpg',
  //     220.99,
  //     new Date(Date.now()),
  //     new Date(Date.now()),
  //     'u1'
  //   ),
  //   new Place(
  //     'p3',
  //     'The Foggy Place',
  //     'Not your average city trip',
  //     'https://s3.envato.com/files/123e6f49-8572-4e47-bef5-ac691abed4e2/inline_image_preview.jpg',
  //     90.99,
  //     new Date(Date.now()),
  //     new Date(Date.now()),
  //     'u2'
  //   ),
  // ]);

  public placesList = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  // getAllPlaces() {
  //   return this.placesList.asObservable();
  // }

  // getPlace(placeId: string) {
  //   return this.placesList.pipe(
  //     take(1),
  //     map((placesList) => ({ ...placesList.find((p) => p.id === placeId) }))
  //   );
  // }

  fetchAllPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://bookings-62ee4-default-rtdb.firebaseio.com/offered-places.json'
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imgUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }
          return places;
          // return [];
        }),
        tap((places) => {
          this.placesList.next(places);
        })
      );
  }

  getPlace(placeId: string) {
    return this.http
      .get<PlaceData>(
        `https://bookings-62ee4-default-rtdb.firebaseio.com/offered-places/${placeId}.json`
      )
      .pipe(
        map(
          (placeData) =>
            new Place(
              placeId,
              placeData.title,
              placeData.description,
              placeData.imgUrl,
              placeData.price,
              new Date(placeData.availableFrom),
              new Date(placeData.availableTo),
              placeData.userId
            )
        )
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
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVudGhvdXNlc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.http
      .post<{ name: string }>(
        'https://bookings-62ee4-default-rtdb.firebaseio.com/offered-places.json',
        { ...newPlace, id: null }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.placesList;
        }),
        take(1),
        tap((placesList) => {
          newPlace.id = generatedId;
          this.placesList.next(placesList.concat(newPlace));
        })
      );
    // return this.placesList.pipe(
    //   take(1),
    //   delay(2000),
    //   tap((placeList) => {
    //     this.placesList.next(placeList.concat(newPlace));
    //   })
    // );
  }

  // updateOffer(placeId: string, title: string, description: string) {
  //   return this.placesList.pipe(
  //     take(1),
  //     delay(2000),
  //     tap((placesList) => {
  //       const updatedPlaceIndex = placesList.findIndex(
  //         (pl) => pl.id === placeId
  //       );
  //       const updatedPlaces = [...placesList];
  //       const oldPlace = updatedPlaces[updatedPlaceIndex];
  //       updatedPlaces[updatedPlaceIndex] = new Place(
  //         oldPlace.id,
  //         title,
  //         description,
  //         oldPlace.imgUrl,
  //         oldPlace.price,
  //         oldPlace.availableFrom,
  //         oldPlace.availableTo,
  //         oldPlace.userId
  //       );
  //       this.placesList.next(updatedPlaces);
  //     })
  //   );
  // }
  updateOffer(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.placesList.pipe(
      take(1),
      switchMap((placesList) => {
        if (!placesList) {
          return this.fetchAllPlaces();
        } else {
          return of(placesList);
        }
      }),
      switchMap((placesList) => {
        const updatedPlaceIndex = placesList.findIndex(
          (pl) => pl.id === placeId
        );
        updatedPlaces = [...placesList];
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
        return this.http.put(
          `https://bookings-62ee4-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this.placesList.next(updatedPlaces);
      })
    );
  }
}
