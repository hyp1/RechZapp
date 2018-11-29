import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { AwriConnectProvider } from '../../providers/awri-connect/awri-connect';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
username:String;
email:String;
password:String;
password2:String;
awri:AwriConnectProvider
  constructor(public navCtrl: NavController, public navParams: NavParams,awri:AwriConnectProvider,public alertCtrl:AlertController) {
    this.awri=awri;
    this.username="";
    this.email="";
    this.password="";
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

registerUser(){
  this.awri.register(this.username,this.password,this.email).then(data=>{
    console.log(data);


  }).catch(err=>{
    console.log(err);
    console.log(err.error.form_errors);
    if(err.status==403)return this.awri.showError("Zugriff nicht erlaubt!");
    var key = Object.keys(err.error.form_errors)[0];
    this.awri.showError(err.error.form_errors[key]);
  });
 // console.log(this.email);
 // console.log(this.username);
 // console.log(this.password);
}
 
fblogin(){
  this.awri.fblogin().then(data=>{
  let dat:any=data;
  console.log(data);
    this.awri.fboauth(dat.authResponse.accessToken).then(res=>{
      console.log(res);   
      this.username=<String>this.awri.user.name;
  });
})
};

showError(msg){
  let alert = this.alertCtrl.create({
    title: 'Fehler',
    message: msg,
    buttons: ['Weiter']
  });
  alert.present();
}


}
