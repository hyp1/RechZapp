import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import "rxjs/add/operator/map";
import { Platform } from 'ionic-angular/platform/platform';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

import { ViewPage } from '../../pages/view/view';

import { LoginPage } from '../../pages/login/login';
import { AwriConnectProvider } from '../../providers/awri-connect/awri-connect';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})

export class SearchPage {
  text: any;
  items: Array<any>;
  awri: AwriConnectProvider;
  rootPage:SearchPage;

  constructor(public navCtrl: NavController, private httpClient: HttpClient, private plt: Platform, private alertCtrl: AlertController, awri: AwriConnectProvider) {    
    this.text="",
    this.awri = awri;
    this.rootPage = <any>SearchPage; 
    this.items=<Array<any>>awri.getItems();
  }



  dosearch(): void {
 //   console.log("SEARCH:"+this.text);    
   this.awri.search(this.text).then(data=>{
     this.items=<Array<any>>data;
    // console.log(this.items);
   },err=>{
    this.awri.showError("Die Suche nach '"+this.text+"' brachte keine Ergebnisse...");
   });
  }

  search(text): void {
    this.text=text;
      this.awri.search(this.text).then(data=>{
        this.items=<Array<any>>data;
       // console.log(this.items);
      },err=>{
       this.awri.showError("Die Suche nach '"+this.text+"' brachte leider keine Ergebnisse...");
      });
     }

  itemSelected(item: any): void {
    this.navCtrl.push(ViewPage, { item: item });
  }
 

  gotoLogin(){
    this.navCtrl.push(LoginPage);
  }
  
}