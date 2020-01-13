import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { ConfigService } from '../config/config';
import { AnimeModel, AnimeListModel } from '../../models/anime/anime';

const KEY_LIST = 'anime-list';
const BASE_URL : string = 'https://api.jikan.moe/v3';
const REQUEST_INTERVAL : number = 4000;

@Injectable()
export class MALService {
  public animeList : AnimeListModel;
  public updating : boolean;
  public ready : Promise<any>;

  constructor(private config : ConfigService, private http : HttpClient, private storage : Storage) {
    this.animeList = { anime: [] };
    this.updating = false;

    // MALService is ready if has loaded and ConfigService is ready
    this.ready = this.load().then(() => this.config.ready);
  }

  load() : Promise<any> {
    return this.storage.get(KEY_LIST).then<AnimeListModel>(animeList => {
      if (animeList) {
        this.animeList = animeList;
      }
      return animeList;
    });
  }

  save() : Promise<any> {
    return this.storage.set(KEY_LIST, this.animeList);
  }

  update() : Promise<void> {
    return new Promise((resolve, reject) => {
      // Check that username is set
      if (!this.config.username) {
        return reject(null);
      }

      // Check that no other update is currently running
      if (this.updating) {
        return;
      }
      this.updating = true;

      // Fetch Plan To Watch list from MAL
      let url = this.buildListUrl(this.config.username);
      let p = this.http.get<AnimeListModel>(url).toPromise();

      // Handle error
      p.catch(err => {
        reject(err);
      });

      // Update anime list
      p.then(animeList => { // TODO check if then class are chained correctly
        let updated = false;
        this.animeList.anime = animeList.anime.map(anime => {
          let currentAnime = this.animeList.anime.find(item => item.mal_id == anime.mal_id);
          if (currentAnime) {
            return currentAnime;
          } else {
            updated = true;
            return anime;
          }
        });
        return updated;
      });

      // Save updated list
      p.then(updated => {
        if (updated) {
          this.save();
        }
        return updated;
      });

      // Update details of list entries
      p.then(updated => {
        if (updated) {
          //updated = false;
          this.animeList.anime.filter(anime => !anime.updated).forEach(anime => {

            // Update in itervals to meet API conditions
            setTimeout(() => {
              let url = this.buildDetailsUrl(anime.mal_id);
              this.http.get<AnimeModel>(url).toPromise().then(details => {
                for (let key in details) {
                  anime[key] = details[key];
                }
              }).catch(err => {
                // ignore
              });
            }, REQUEST_INTERVAL);
            anime.updated = true;
            //updated = true;
          });
        }
        return updated;
      });

      // Resolve with complete list and save
      p.then(updated => {
        if (updated) {
          this.save();
        }
        this.updating = false;
        resolve();
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
