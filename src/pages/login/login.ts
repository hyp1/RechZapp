import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AwriConnectProvider } from '../../providers/awri-connect/awri-connect';
import { RegisterPage } from '../../pages/register/register';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private username:String;
  private password:String;
  awri:AwriConnectProvider;
  constructor(public navCtrl: NavController, public navParams: NavParams,awri:AwriConnectProvider) {
    this.awri=awri;
    this.username=this.awri.username;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){
    //alert('username: ' + this.username);
    this.awri.login(this.username,this.password).then(data=>{
      
      let res=<any>data
      this.username=<String>this.awri.username;
     if(res.username)this.username=<String>res.username;

     //this.awri.showInfo("Sie sind nun als "++"");
    }).catch(err=>{
//        console.log(err);
        this.awri.showError(err);
    });
    
   // console.log(this.mylblRef.nativeElement.innerText);
  //  this.username="Bert"
  }

  gotoRegister(){
    this.navCtrl.push(RegisterPage);
  }

  sendPassword(){

  }
  
}
