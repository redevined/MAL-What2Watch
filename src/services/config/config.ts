import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const KEY_USERNAME : string = 'username';

@Injectable()
export class ConfigService {
  public username : string;
  public ready : Promise<any>;

  constructor(private storage : Storage) {
    this.username = '';
    this.ready = this.load();
  }

  load() : Promise<any> {
    return this.storage.get(KEY_USERNAME).then(data => {
      if (data) {
        this.username = data;
      }
    });
  }

  save() : Promise<any> {
    return this.storage.set(KEY_USERNAME, this.username);
  }

  clear() : Promise<void> {
    this.username = '';
    return this.storage.clear();
  }
}
