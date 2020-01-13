import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';
import { SettingsPage } from '../settings/settings';
import { MALService } from '../../services/mal/mal';
import { AnimeModel, AnimeListModel } from '../../models/anime/anime';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit {
  constructor(private navCtrl: NavController, private navParams: NavParams, private alert : AlertController, private mal : MALService) { }

  ngOnInit() {
    this.mal.ready.then(() => this.sync());
  }

  sync() {
    this.mal.update().catch(err => {
      // Redirect to settings
      let msg = err ? 'Given user does not exist.' : 'You did not set your Username yet.';
      msg = msg + '\nPlease visit the Settings page.';
      this.alert.create({
        title: 'Warning',
        subTitle: msg,
        buttons: [{
          text: 'OK',
          handler: data => {
            this.navCtrl.setRoot(SettingsPage);
          }
        }]
      }).present();
    });
  }

  itemTapped(event, item) {
    // this.navCtrl.push(ItemDetailsPage, {
    //   item: item
    // });
  }
}
