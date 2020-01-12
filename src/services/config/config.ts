import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const KEY_USERNAME : string = 'username';

@Injectable()
export class ConfigService {
  public username : string;

  constructor(public storage : Storage) {
    this.load();
  }

  load() {
    return this.storage.get(KEY_USERNAME).then(data => {
      if (data) {
        this.username = data;
      } else {
        this.username = '';
      }
    });
  }

  save() {
    return this.storage.set(KEY_USERNAME, this.username);
  }
}
