import { Component } from '@angular/core';

import { ConfigService } from '../../services/config/config';
import { MALService } from '../../services/mal/mal';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  constructor(private mal : MALService) { }

  clear() : void {
    this.mal.reset(); // TODO confirm dialog
  }
}
