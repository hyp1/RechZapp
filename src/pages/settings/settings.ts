import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AwriConnectProvider } from '../../providers/awri-connect/awri-connect';


import 'rxjs/add/operator/map';
import { LoginPage } from '../../pages/login/login';
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
  //@ViewChild('userField') username:Input;
  private username:String;
  private password:String;
color:any;

  private fbtoken:String;

  private help:any;

  //password:string='kimo2002';
private awri:AwriConnectProvider; 
  constructor(public navCtrl: NavController,public navParams: NavParams,awri:AwriConnectProvider) {   
    this.awri=awri;
this.username=this.awri.user.name;
this.getColor();

this.help=this.awri.getHelp();
  }
  
  
 helpChanged(){

 console.log(this.help);
this.awri.setHelp(this.help);
  }

getUsername(){
  return this.awri.user.name;
}

login(){
  //alert('username: ' + this.username);
  this.awri.login(this.username,this.password).then(data=>{
   // console.log(data);
  }).catch(err=>{
      console.log(err);
  });

}

dofblogin(){
this.awri.fblogin().then(data=>{
let color:string;
  let res=<any>data;
  this.awri.access_token=<string>res.authResponse.accessToken; 

  this.fbtoken=<string>res.authResponse.accessToken; 

  console.log(this.fbtoken);
  if(this.fbtoken)this.awri.fboauth(this.fbtoken).then(data2=>{
    console.log(data2);
    let res2=<any>data2;
     
  });
 // console.log(data);
});
}

connect(){
  console.log("Connect")
this.awri.connect().then(data=>{
    //let res=<any>data;
   // this.uid=<Number>res.uid; 
  //  this.session=<String>res.session; 
   // this.username=<String>res.username; 

    console.log(data);
  },err=>{

    console.log(err);
  });
  
  }

authRequest(){

this.awri.authRequest().then(data=>{
  console.log(data);
});

}


loadNode(){
  this.awri.loadNode(18013).then(data=>{
    console.log(data);
  });
}


gotoLogin(){
  this.navCtrl.push(LoginPage);
}


setColor(color){
  this.awri.set('color',color).then(col=>{
    this.color=col;
  });
}

getColor(){
  this.color=this.awri.get('color').then(col=>{
    this.color=col;
  });;
}
removeColor(){
  this.awri.remove('color');
  this.color="";
}

}
