import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ListPage } from '../pages/list/list';
import { FilterSortPage } from '../pages/filter-sort/filter-sort';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { SettingsPage } from '../pages/settings/settings';

import { MALService } from '../services/mal/mal';
import { FilterSortService } from '../services/filter-sort/filter-sort';
import { ConfigService } from '../services/config/config';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MyApp,
    ListPage,
    FilterSortPage,
    ItemDetailsPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListPage,
    FilterSortPage,
    ItemDetailsPage,
    SettingsPage
  ],
  providers: [
    MALService,
    FilterSortService,
    ConfigService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
