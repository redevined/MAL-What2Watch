import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FilterSortService } from '../../services/filter-sort/filter-sort';
import { AnimeModel } from '../../models/anime/anime';

@Component({
  selector: 'page-filter-sort',
  templateUrl: 'filter-sort.html'
})
export class FilterSortPage {
  constructor(private navCtrl: NavController, private navParams: NavParams, private filterSort : FilterSortService) { }

  apply() : void {
    this.navCtrl.pop();
  }
}
