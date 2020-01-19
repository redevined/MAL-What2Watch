import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { ConfigService } from '../config/config';
import { AnimeModel, AnimeListModel } from '../../models/anime/anime';

const KEY_USERNAME : string = 'username';
const KEY_LIST : string = 'anime-list';
const BASE_URL : string = 'https://api.jikan.moe/v3';
const REQUEST_INTERVAL : number = 4000;

@Injectable()
export class MALService {
  public username : string;
  public animes : AnimeModel[];
  public updating : boolean;
  public ready : Promise<any>;

  constructor(private http : HttpClient, private storage : Storage) {
    this.init();
    this.ready = this.load();
  }

  init() : void {
    this.username = '';
    this.animes = [];
    this.updating = false;
  }

  reset() : Promise<void> {
    this.init();
    return this.storage.clear();
  }

  async load() : Promise<void> {
    let username = await this.storage.get(KEY_USERNAME);
    if (username) {
      this.username = username;
    }
    let animes = await this.storage.get(KEY_LIST);
    if (animes) {
      this.animes = animes;
    }
  }

  saveUsername() : Promise<any> {
    return this.storage.set(KEY_USERNAME, this.username);
  }

  saveAnimes() : Promise<any> {
    return this.storage.set(KEY_LIST, this.animes);
  }

  async update() : Promise<void> {
    // Check that username is set and no other update is currently running
    if (!this.username) {
      throw new Error('No MAL username set.');
    } else if (this.updating) {
      return;
    }
    this.updating = true;

    // Cleanup function
    let finishUpdate = () => {
      this.saveAnimes();
      this.updating = false;
    };

    // Fetch Plan To Watch list from MAL
    let animes : AnimeModel[];
    try {
      let url = this.buildListUrl(this.username);
      let animeList = await this.http.get<AnimeListModel>(url).toPromise();
      animes = animeList.anime;
    } catch (err) {
      console.error(err);
      finishUpdate();
      throw new Error('The specified user does not exist.');
    }

    // Update anime list
    this.animes = animes.map(anime => {
      let currentAnime = this.animes.find(item => item.mal_id == anime.mal_id);
      if (currentAnime) {
        return currentAnime;
      } else {
        anime.synced = false;
        return anime;
      }
    });

    // Identify list entries without details
    let queue = this.animes.filter(anime => !anime.synced);
    if (!queue.length) {
      return finishUpdate();
    }

    // Fetch details in intervals to meet API conditions
    let task = setInterval(async () => {

      // Get next anime in queue
      let anime = queue.shift();
      if (!anime) {
        clearInterval(task);
        return finishUpdate();
      }

      try {
        // Get details and copy them
        let url = this.buildDetailsUrl(anime.mal_id);
        let details = await this.http.get<AnimeModel>(url).toPromise();
        for (let key in details) {
          anime[key] = details[key];
        }
      } catch (err) {
        // Handle error and reappend anime to queue
        console.error(err);
        queue.push(anime);
        return;
      }
      
      // Set synced flag
      anime.synced = true;
      this.saveAnimes();

    }, REQUEST_INTERVAL);
  }

  buildListUrl(username : string) : string {
    return BASE_URL + '/user/' + username + '/animelist/plantowatch';
  }

  buildDetailsUrl(mal_id : number) : string {
    return BASE_URL + '/anime/' + mal_id;
  }
}
