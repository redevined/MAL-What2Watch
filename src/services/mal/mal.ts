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

  update() : Promise<void> { // TODO async/await
    return new Promise((resolve, reject) => {
      // Check that username is set
      if (!this.username) {
        return reject(null);
      }

      // Check that no other update is currently running
      if (this.updating) {
        return;
      }
      this.updating = true;

      let finishUpdate = () => {
        this.saveAnimes();
        this.updating = false;
        resolve();
      };

      // Fetch Plan To Watch list from MAL
      let url = this.buildListUrl(this.username);
      let p = this.http.get<AnimeListModel>(url).toPromise();

      // Update anime list
      p.then(animeList => {
        this.animes = animeList.anime.map(anime => {
          let currentAnime = this.animes.find(item => item.mal_id == anime.mal_id);
          if (currentAnime) {
            return currentAnime;
          } else {
            anime.synced = false;
            return anime;
          }
        });

        // Update details of list entries
      }).then(() => {
        let animeToSync = this.animes.filter(anime => !anime.synced);
        if (!animeToSync.length) {
          return finishUpdate();
        }

        // Update in intervals to meet API conditions
        let task = setInterval(() => {
          let anime = animeToSync.shift();
          if (!anime) {
            // Save updates
            clearInterval(task);
            return finishUpdate();
          }

          let url = this.buildDetailsUrl(anime.mal_id);
          this.http.get<AnimeModel>(url).toPromise().then(details => {
            for (let key in details) {
              anime[key] = details[key];
            }

            anime.synced = true;
            this.saveAnimes();
          }).catch(err => {
            console.log(err);
          });
        }, REQUEST_INTERVAL);

        // Handle error
      }).catch(err => {
        reject(err);
      });
    });
  }

  buildListUrl(username : string) : string {
    return BASE_URL + '/user/' + username + '/animelist/plantowatch';
  }

  buildDetailsUrl(mal_id : number) : string {
    return BASE_URL + '/anime/' + mal_id;
  }
}
