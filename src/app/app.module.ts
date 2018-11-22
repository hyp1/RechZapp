import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { IonicStorageModule } from '@ionic/storage';
import { AwriConnectProvider } from '../providers/awri-connect/awri-connect';

import { HttpClientModule } from '@angular/common/http'
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { ViewPage } from '../pages/view/view';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { CreatePage } from '../pages/create/create';
import { HelpPage } from '../pages/help/help';

import { Camera} from '@ionic-native/camera';

import { UploadComponent } from '../components/upload/upload';
import { FragenProvider } from '../providers/fragen/fragen';

//AdMob
import { AdMobFree } from '@ionic-native/admob-free';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SearchPage,
    SettingsPage,
    ViewPage,
    RegisterPage,
    CreatePage,
    LoginPage,
    HelpPage,
    UploadComponent
  ],
  
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
  ],   

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SearchPage,
    SettingsPage,
    ViewPage,
    RegisterPage,
    CreatePage,
    LoginPage,
    HelpPage
  ],

  providers: [
    StatusBar,    
    SplashScreen,    
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    AwriConnectProvider,
    UploadComponent,
    FragenProvider,
    AdMobFree,
  ]
})


export class AppModule {}
