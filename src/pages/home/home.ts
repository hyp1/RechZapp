import { Component,ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
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
  @ViewChild(Content) content: Content;
rootPage:HomePage;
  error:String;
  text:any;  
  username: String;
  items: Observable<any>;
  awri: AwriConnectProvider;
index:Array<any>;
pages:number;
page:number;
scrollingTop:boolean;
  constructor(public navCtrl: NavController,private admobFree: AdMobFree, awri: AwriConnectProvider) {
    this.error="";
    this.rootPage = <any>HomePage;
    this.awri=awri;
    this.page=0;
    this.pages=10;
    this.index=[];

this.getFragen();
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
    this.error="";
    this.awri.search(this.text).then(data=>{
        this.items=<any>data;
      //  console.log(this.items);
    },err=>{
        this.error="Die Suche nach '"+this.text+"' brachte leider keine Ergebnisse...";
        //  this.awri.showError("Die Suche nach '"+this.text+"' brachte leider keine Ergebnisse...");
    });
  }
  
  resetSearch(){
    this.awri.resetSearch();
    this.items=null;
  };


    itemSelected(item:any):void{
      this.navCtrl.push(ViewPage, { item: item });
    }

  ionViewWillEnter() {
    this.username=this.awri.getName();
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


  scrollTo(element:string) {

    let yOffset = document.getElementById(element).offsetTop;
this.content.scrollTo(0, yOffset, 4000).then(data=>{
  console.log(data);
},err=>{
  console.log(err);
});
  }

  scrollToTop(): void {
    if (!this.scrollingTop) {
      this.scrollingTop = true;
      try {
        let yOffset = document.getElementById('scrollTop').offsetTop;
        this.content.scrollTo(0, yOffset, 4000)
          .then(res => this.scrollingTop = false)
          .catch(err => console.log(err)); // show log in dev env
      } catch (e) {
        this.scrollingTop = false
        console.log(e);
      //  this.logService.warn(e); // show log in dev env
      }
    }
  }
  
  getFragen(){
    this.awri.getFragenIndex(this.page,this.pages).then(index=>{
      let dat:any=index;
      for(var i=0;i<this.pages;i++)
          this.index.push(dat[i]);
      //console.log(this.index);
      this.page++;
    },err=>{
      console.log(err);
    })
  }

 frageSelected(n:any):void{
   //console.log(n)
   this.awri.getFrage(n.nid).then(res=>{
    let item:any=res;
   //  console.log(item);
    this.navCtrl.push(ViewPage, { item: {node:JSON.parse(item)} });
   });
  }

  
  doInfinite(infiniteScroll) {
 //   console.log('Begin async operation');
  
    setTimeout(() => {
      /*
      for (let i = 0; i < 30; i++) {
        this.index.push( this.index.length );
      }
  */
  this.getFragen();
 //     console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  eventHandler(event){

    console.log(event);
  }
}
