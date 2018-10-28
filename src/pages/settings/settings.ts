import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AwriConnectProvider } from '../../providers/awri-connect/awri-connect';

import 'rxjs/add/operator/map';
import { ElementRef } from '@angular/core';
/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  uid:Number;
  username:String;
  password:String;
  session:String;
  token:String;

  //username:string='root';
  //password:string='kimo2002';
awri:AwriConnectProvider; 
  constructor(public navCtrl: NavController, public navParams: NavParams, awri:AwriConnectProvider) {   
this.awri=awri;
this.uid=awri.uid;
this.username=awri.username;
this.session=awri.session;
this.token=awri.token;


  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  
  getUsername(){
    return this.username;
  }


login(){
  //alert('username: ' + this.username);
  this.awri.login(this.username,this.password).then(data=>{
    let res=<any>data
    this.uid=<Number>res.uid;
    this.username=<String>res.username;
    this.session=<String>res.session;
    this.token=<String>res.token;  
  });;
 // console.log(this.mylblRef.nativeElement.innerText);
//  this.username="Bert"
}

back(){
this.navCtrl.pop();
}


}
