import { Component } from '@angular/core';
import { ConfigService } from '../../services/config/config';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  constructor(public config : ConfigService) {

  }
}
