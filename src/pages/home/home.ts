import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

import { AwriConnectProvider } from '../../providers/awri-connect/awri-connect';
import { ViewPage } from '../../pages/view/view';

import { SearchPage } from '../../pages/search/search';
import { RegisterPage } from '../../pages/register/register';
import { LoginPage } from '../../pages/login/login';
import { Observable } from 'rxjs/Observable';

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
rootPage:HomePage;

  text:any;  
  username: String;
  items: Observable<any>;
  awri: AwriConnectProvider;
  color:String;

  constructor(public navCtrl: NavController,private admobFree: AdMobFree, awri: AwriConnectProvider) {
    this.rootPage = <any>HomePage;
    this.awri=awri;

//Suche persistent
  this.items=<any>awri.getItems();

  this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare()
      .then(() => {
        // banner Ad is ready
        // if we set autoShow to false, then we will need to call the show method here
        console.log("BannerConfig");
      })
      .catch(e => console.log(e));    
  }



  gotoLogin():void{
      this.navCtrl.push(LoginPage)
  }
    

  dosearch():void{

this.awri.search(this.text).then(data=>{
  this.items=<any>data;
//  console.log(this.items);
},err=>{

  this.awri.showError("Die Suche nach '"+this.text+"' brachte leider keine Ergebnisse...");
});
//this.items=this.awri.getItems();
    }
  

    itemSelected(item:any):void{
      console.log(item);
      this.navCtrl.push(ViewPage, { item: item });
      //alert(item.node.nid);
      }

      ionViewWillEnter() {

    //this.username=this.awri.username;
    this.username=this.awri.getName();
    console.log('ionViewWillEnter HOME'+this.username);
  }

  openPage(p){
    this.rootPage=p;
  }

  gotoSearch(){
    this.navCtrl.push(SearchPage)
  }
  

  gotoRegister(){
    this.navCtrl.push(RegisterPage)
  }

  getColor(){
    this.awri.get('color').then(data=>{
      this.color=data;
    })
  }


  setColor(color){
    this.color=color;
    this.awri.set('color',color);
    }


}
