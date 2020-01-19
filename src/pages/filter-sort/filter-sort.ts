import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FilterSortService } from '../../services/filter-sort/filter-sort';
import { AnimeModel, keyNameMap } from '../../models/anime/anime';

@Component({
  selector: 'page-filter-sort',
  templateUrl: 'filter-sort.html'
})
export class FilterSortPage {
  private sortKeys : string[] = [
    'title',
    'type',
    'total_episodes',
    'score',
    'rank',
    'popularity',
    'source',
    'premiered'
  ];
  private keyNameMap : any = keyNameMap;

  constructor(private navCtrl: NavController, private navParams: NavParams, private filterSort : FilterSortService) { }

  apply() : void {
    this.navCtrl.pop();
  }
}
