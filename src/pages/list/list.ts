import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { FilterSortPage } from '../filter-sort/filter-sort';
import { ItemDetailsPage } from '../item-details/item-details';
import { SettingsPage } from '../settings/settings';
import { MALService } from '../../services/mal/mal';
import { FilterSortService } from '../../services/filter-sort/filter-sort';
import { AnimeModel, AnimeListModel } from '../../models/anime/anime';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit {
  constructor(private navCtrl: NavController, private navParams: NavParams, private alert : AlertController,
              private mal : MALService, private filterSort : FilterSortService) { }

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

  openFilterSort() {
    this.navCtrl.push(FilterSortPage);
  }

  openDetails(anime : AnimeModel) {
    // this.navCtrl.push(ItemDetailsPage, {
    //   item: item
    // });
  }
}
