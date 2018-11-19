import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AwriConnectProvider } from '../../providers/awri-connect/awri-connect';
import { LoginPage } from '../../pages/login/login';
/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


 //https://stage.awri.ch/?q=drupalgap/node.json&fields=nid,title,created,status&parameters[type]=rechtsfrage&parameters[status]=1&options[orderby][created]=desc&page=0&pagesize=10
//https://stage.awri.ch/?q=drupalgap/awri_services_resources/rechtsfrage

 @IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  awri:AwriConnectProvider;
  constructor(public navCtrl: NavController, public navParams: NavParams,awri:AwriConnectProvider) {
  this.awri=awri;
}
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
  }


gotoLogin():void{
  this.navCtrl.push(LoginPage)
}    

}
