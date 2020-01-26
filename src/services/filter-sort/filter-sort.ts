import { Injectable } from '@angular/core';

import { AnimeModel } from '../../models/anime/anime';

@Injectable()
export class FilterSortService {
  public active : boolean;
  public sortKey : string;
  public sortAscending : boolean;
  public filterCrit : FilterCriteria;

  constructor() {
    this.reset();
  }

  reset() : void {
    this.active = false;
    this.sortKey = 'title';
    this.sortAscending = true;
    this.filterCrit = {
      'total_episodes': {
        'lower': 0, 'upper': 50, 'min': 0, 'max': 50, 'step': 1
      },
      'score': {
        'lower': 0, 'upper': 10, 'min': 0, 'max': 10, 'step': 1
      },
      'rank': {
        'lower': 0, 'upper': 100, 'min': 0, 'max': 100, 'step': 1
      },
      'popularity': {
        'lower': 0, 'upper': 100, 'min': 0, 'max': 100, 'step': 1
      }
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
    animes = animes.filter(anime => anime[this.sortKey] != undefined);
    animes = animes.sort((a, b) => {
      if (a[this.sortKey] < b[this.sortKey]) { // TODO if sortKey is premiered then convert to date
        return this.sortAscending ? -1 : 1;
      } else if (a[this.sortKey] > b[this.sortKey]) {
        return this.sortAscending ? 1 : -1;
      } else {
        return 0;
      }
    });
    return animes;
  }
}

interface FilterCriteria {
  title? : string;
  total_episodes? : Range;
  score? : Range;
  rank? : Range;
  popularity? : Range;
  type? : string;
  status? : string;
  source? : string;
  premiered? : string;
  studioName? : string;
  genreName? : string;
}

interface Range {
  lower : number;
  upper : number;
  max : number;
  min : number;
  step : number;
}
