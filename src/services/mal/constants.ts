import { Injectable } from '@angular/core';

import { AnimeModel, ATTR_NAME_MAP } from '../../models/anime/anime';

@Injectable()
export class MALConstantsService {
  public type : Set<string> = new Set(); // TODO sorted set? 
  public status : Set<string> = new Set();
  public source : Set<string> = new Set();
  public premiered : Set<string> = new Set();
  public studioName : Set<string> = new Set();
  public genreName : Set<string> = new Set();

  constructor() { }

  generate(animes : AnimeModel[]) : void {
    for (let anime of animes) {
      this.type.add(anime.type);
      this.status.add(anime.status);
      this.source.add(anime.source);
      this.premiered.add(anime.premiered);
      anime.studios.forEach(studio =>
        this.studioName.add(studio.name));
      anime.genres.forEach(genre =>
        this.genreName.add(genre.name));
    }
  }

  getAttributeName(attr : string) : string {
    return ATTR_NAME_MAP[attr];
  }
}