import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

const bannerConfig: AdMobFreeBannerConfig = {
  // add your config here
  // for the sake of this example we will just use the test config
  isTesting: true,
  autoShow: true
 };

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  constructor(public navCtrl: NavController,private admobFree: AdMobFree) {
    console.log("HOMEPAGE");
    
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare()
      .then(() => {
        // banner Ad is ready
        // if we set autoShow to false, then we will need to call the show method here
        console.log("BannerConfig");
      })
      .catch(e => console.log(e));
    
  }

}
