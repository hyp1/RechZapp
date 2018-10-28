import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';



//import { HttpClient, HttpClientModule } from '@angular/common/http';
//import 'rxjs/add/operator/map';
 

import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

import { AwriConnectProvider } from '../../providers/awri-connect/awri-connect';



const bannerConfig: AdMobFreeBannerConfig = {
  // add your config here
  // for the sake of this example we will just use the test config
  isTesting: true,
  autoShow: true
 };

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
private rootPage;

  text:any;  
  username: String;
  items = [];
  awri: AwriConnectProvider;
  constructor(public navCtrl: NavController,private admobFree: AdMobFree, awri: AwriConnectProvider) {
    this.rootPage = HomePage;


    console.log("HOMEPAGE");
    this.awri=awri;
 
//http.get()
this.items=awri.getItems();
//this.username=<String>awri.username;
//this.username=;
   //console.log(this.settingsPage);
  //awri.connect();

  
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare()
      .then(() => {
        // banner Ad is ready
        // if we set autoShow to false, then we will need to call the show method here
        console.log("BannerConfig");
      })
      .catch(e => console.log(e));
    
  }
  gotoSettings():void{
  //this.navCtrl.push('SettingsPage')
  }

  dosearch():void{
console.log(this.text);

this.awri.search(this.text).then(data=>{
  this.items=<any[]>data;
  console.log(this.items);
});
//this.items=this.awri.getItems();

    }
  
    itemSelected(item:any):void{
      console.log(item);
      alert(item.node.nid);
      }

      ionViewWillEnter() {

    //this.username=this.awri.username;
    this.username=this.awri.getName();
    console.log('ionViewWillEnter HOME'+this.username);
  }

  openPage(p){
    this.rootPage=p;
  }

}
