import { Injectable } from '@angular/core';

import { AnimeModel } from '../../models/anime/anime';

@Injectable()
export class FilterSortService {
  public sortKey : string;
  public sortAscending : boolean;
  public filterCrit : AnimeModel;

  constructor() {
    this.reset();
  }

  reset() : void {
    this.sortKey = 'title';
    this.sortAscending = true;
    this.filterCrit = {
      studios: [{mal_id: -1, name: ''}],
      genres: [{mal_id: -1, name: ''}]
    };
  }

  apply(animes : AnimeModel[]) : AnimeModel[] {
    animes = this.filter(animes);
    animes = this.sort(animes);
    return animes;
  }

  filter(animes : AnimeModel[]) : AnimeModel[] {
    return animes;
  }

  sort(animes : AnimeModel[]) : AnimeModel[] {
    return animes.sort((a, b) => {
      if (a[this.sortKey] < b[this.sortKey]) { // TODO if sortKey is premiered then convert to date
        return this.sortAscending ? -1 : 1;
      } else if (a[this.sortKey] > b[this.sortKey]) {
        return this.sortAscending ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
