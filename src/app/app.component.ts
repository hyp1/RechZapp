import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { SearchPage } from '../pages/search/search';
import { CreatePage } from '../pages/create/create';
import { HelpPage } from '../pages/help/help';
import { AwriConnectProvider } from '../providers/awri-connect/awri-connect';
import { FragenProvider } from '../providers/fragen/fragen';
//import { ViewPage } from '../pages/view/view';
//import { UploadComponent } from '../components/upload/upload';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, isActive: boolean,icon:String}>;
  
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public awri:AwriConnectProvider, public fragen:FragenProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage,isActive:true,icon:'home' },
      { title: 'Suchen', component: SearchPage,isActive:false,icon:'search'  },
      { title: 'Frage stellen', component: CreatePage,isActive:false,icon:'help'  },    
      { title: 'Einstellungen', component: SettingsPage,isActive:false,icon:'construct'  },
      { title: 'Hilfe', component: HelpPage,isActive:false,icon:'bug'  },
    ];
 
  }         
  

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
       this.statusBar.styleDefault();

      this.splashScreen.hide();
    });
  }

  public openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component); 
    this.pages.map(p => {
      p.isActive = (page.title == p.title);
    });    
   
  }

  
}
