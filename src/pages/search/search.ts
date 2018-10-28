import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import "rxjs/add/operator/map";
import { Platform } from 'ionic-angular/platform/platform';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';


import { AwriConnectProvider } from '../../providers/awri-connect/awri-connect';

@Component({
 selector: 'page-search',
 templateUrl: 'search.html'
})

export class SearchPage {

 items: Observable<any>;
 awri:AwriConnectProvider;
 constructor(public navCtrl: NavController, private httpClient: HttpClient, private plt: Platform, private alertCtrl: AlertController, awri:AwriConnectProvider) {
  this.awri=awri;
  //this.items = this.httpClient.get('https://randomuser.me/api/?results=20')
  // .map(res => res['results'])
   
   this.items = this.httpClient.get('https://awri.ch/drupalgap/search_node/retrieve.json?keys=Miete')
   .map(res => res);
 }
 checkPlatform() {
   let alert = this.alertCtrl.create({
     title: 'Platform',
     message: 'You are running on: ' + this.plt.platforms(),
     buttons: ['OK']
   });
   alert.present();

   if (this.plt.is('cordova')) {
     // Do Cordova stuff
   } else {
     // Do stuff inside the regular browser
   }
 }
}