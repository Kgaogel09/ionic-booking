/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private placesList: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York',
      'https://static2.mansionglobal.com/production/media/article-images/2f6a5dc3d80ef19f3bc23ddc1e911adf/large_Screen-Shot-2017-12-07-at-12.11.10-PM.png',
      150.99,
      new Date('2022-01-01'),
      new Date('2022-12-31')
    ),
    new Place(
      'p2',
      'Bonsoir',
      'A romantic place Paris',
      'https://i.pinimg.com/736x/6e/12/a3/6e12a3c9d28b00988370e1c646ad2d7a.jpg',
      220.99,
      new Date('2022-01-01'),
      new Date('2022-12-31')
    ),
    new Place(
      'p3',
      'The Foggy Place',
      'Not your average city trip',
      'https://s3.envato.com/files/123e6f49-8572-4e47-bef5-ac691abed4e2/inline_image_preview.jpg',
      90.99,
      new Date('2022-01-01'),
      new Date('2022-12-31')
    ),
  ];

  constructor() {}

  getAllPlaces() {
    return [...this.placesList];
  }

  getPlace(placeId: string) {
    return {
      ...this.placesList.find((place) => place.id === placeId),
    };
  }
}
