import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MALConstantsService } from '../../services/mal/constants';
import { FilterSortService } from '../../services/filter-sort/filter-sort';
import { AnimeModel } from '../../models/anime/anime';

@Component({
  selector: 'page-filter-sort',
  templateUrl: 'filter-sort.html'
})
export class FilterSortPage {
  private sortKeys : string[] = [
    'title',
    'type',
    'status',
    'total_episodes',
    'score',
    'popularity',
    'source',
    'premiered'
  ];

  constructor(private navCtrl: NavController, private navParams: NavParams, private filterSort : FilterSortService, private malConstants : MALConstantsService) { }

  apply() : void {
    this.navCtrl.pop();
  }

  reset() : void {
    this.filterSort.reset();
  }
}
