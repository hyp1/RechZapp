import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Platform } from 'ionic-angular/platform/platform';

//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AlertController,LoadingController,Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';


/*
  Generated class for the AwriConnectProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export interface User {
  uid:Number;
  username: String;
  session:String;
  token:String;
}

declare var openFB;



@Injectable()
export class AwriConnectProvider {


//public  HOST='http://kimo2007.dnshome.de:8888/stage.awri.ch'
//public  HOST='http://localhost/stage.awri.ch'

public  HOST='https://stage.awri.ch'

//public uid:Number;
//public username:String;
//public userpic:String;

public session:String;
public token:String;

//public fbid:Number;
public access_token:String;

private items:Array<any>;

//public roles:Array<any>;
loading:Loading;
stats:Array<any>;

public user: {
  uid: number;
  name: string;
  email: string;
  picture: string;
  roles: Array<any>;
  created: number;
  fbid: number;
};

  constructor(public http: HttpClient,public storage: Storage,private plt:Platform,private alertCtrl:AlertController,public loadingCtrl: LoadingController) {

this.user={
  uid:0,
  name:'Unbekannt',
  email:'',
  picture:'assets/imgs/anonymous.png',
  roles:[{0:'anonymous user'}],
  created:Date.now(),
  fbid:0
};


//    this.uid=0;
//    this.username='Unbekannt';
//    this.userpic='assets/imgs/anonymous.png';
//    this.roles=[{0:'anonymous user'}];
    this.session=null;
    this.token=null;
    this.items=null;
    this.access_token=null;
    //openFB.init({appId:'126766317359254',scope:'email'});
    //console.log(openFB),
    this.checkUser().then(data=>{
  //    console.log(data);
      this.getStats();
    },err=>{
      console.log(err);
    });
    

  }
  

  public set(settingName,value){
    return this.storage.set(`setting:${ settingName }`,value);
  }
  public async get(settingName){
    return await this.storage.get(`setting:${ settingName }`);
  }
  
  public async remove(settingName){
    return await this.storage.remove(`setting:${ settingName }`);
  }

  public clear() {
    let alert = this.alertCtrl.create({
      title: 'Einstellungen löschen',
      message: 'Möchten Sie Ihre gespeicherten Einstellungen wirklich löschen?',
      cssClass:'danger',
      buttons: [
        {
          text: 'Nein',
          role: 'cancel',
          handler: () => {
            console.log('Nein clicked');
          }
        },
        {
          text: 'Ja',
          handler: () => {
            console.log('Ja clicked');
            this.storage.clear().then(() => {
              console.log('all keys cleared');
            });
          }
        }
      ]
    });
    alert.present();
  }

  showLoading(text){
    this.loading = this.loadingCtrl.create({
      content: text
    });
    this.loading.present();
  }
  
  hideLoading(){
    this.loading.dismiss();
  }

  getImagePath(uri):String{
    return uri.replace('public://attachments/',this.HOST+'/sites/default/files/attachments/');
};


  getStats(){
    return new Promise(resolve=>{
  //    let headers = new HttpHeaders()
//      .set('Access-Control-Allow-Origin','*').set('Content-Type', 'application/json')
  //    let options = {
  //      headers: headers,

//      };
        this.http.post(this.HOST+'/stats.txt', null,{ responseType: 'text'})
       // .map(res=>res)
        .subscribe(data=>{
          this.stats=<any>JSON.parse(data);
          console.log(this.stats,"getStatus");
        resolve(data);
        });
    })   
  }
  
  getFragenIndex(page,pages){
    return new Promise((resolve,reject)=>{
        this.http.get(this.HOST+'/drupalgap/node.json?fields=nid,title,created,status&parameters[type]=rechtsfrage&parameters[status]=1&options[orderby][created]=desc&page='+page+'&pagesize='+pages)
       // .map(res=>res)
        .subscribe(data=>{
   //       console.log(data);
        resolve(data);
        },err=>{
          reject(err);
        });
    })   
  }


  getFrage(nid){
    return new Promise((resolve,reject)=>{
     let headers = new HttpHeaders()
      .set('X-CSRF-TOKEN',<string>this.token).set('Content-Type', 'application/json')
     
    let options = {
      headers: headers,
      withCredentials	: true,
    };
       this.http.post(this.HOST+'/?q=drupalgap/awri_services_resources/rechtsfrage',{nid:nid}, options).subscribe(data => {
          resolve(data);    
        },err=>{
          reject(err);
        });    
  })
   
  }

getComments(nid){
  return new Promise((resolve,reject)=>{
   this.http.get(this.HOST+'/drupalgap/comment.json?parameters[nid]='+nid+'&parameters[status]=1&pagesize=150').subscribe(data=>{
    resolve(data);
  },err=>{
    reject(err);
  });
})
 
}

  loadUser(uid){
    return new Promise((resolve,reject) => {
    let headers = new HttpHeaders()
    .set('X-CSRF-TOKEN',<string>this.token).set('Content-Type', 'application/json')
    .set('Authentication', <string>this.session);
    //.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
   // .set('Access-Control-Allow-Headers', 'Content-Type,X-CSRF-TOKEN');
  
  let options:any = {
    headers: headers,
    withCredentials	: 'true',
  };
  
    this.http.get(this.HOST+'/?q=drupalgap/user/'+uid+'.json', options).subscribe(data => {
 
      resolve(data);
     },err=>{
       reject(err);
     })
    })
    }

    
  checkUser() {
    return new Promise((resolve, reject)  => {
      this.http.get(this.HOST+'/?q=services/session/token', { responseType: 'text', withCredentials:true }).map(res=>res).subscribe(data=> {
      this.token=data;
      this.set('token',this.token);
      const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-CSRF-TOKEN', <string>this.token)     

      const options = {
          headers: headers,     
          withCredentials:true
        };  
      this.http.post(this.HOST+'/?q=drupalgap/system/connect.json',null,options).subscribe(data => {
      let dat:any=data;
     // this.user=dat.user;
      this.user.uid=dat.user.uid;
      this.user.roles=dat.user.roles;
      this.set('session_name',dat.session_name);
      this.set('sessid',dat.sessid);      
      this.session=dat.session_name+'='+dat.sessid;
      if(this.user.uid>0){
        this.user.name=dat.user.name;      
        this.user.email=dat.user.mail;      
     
      this.loadUser(this.user.uid).then(data=>{
        let vars:any=data;  
        this.user.name=vars.name;
        this.user.uid=vars.uid;
        this.user.roles=vars.roles;        
        if(this.user.uid>0){
         // this.username=vars.user.name;
          if(vars.field_fbid['und'])this.user.fbid=vars.field_fbid['und'][0].value;
          if(this.user.fbid)this.user.picture="https://graph.facebook.com/"+this.user.fbid+"/picture"     
          if(vars.picture) this.user.picture=vars.picture.url;
        }        
      });
    }
      resolve(data);
      }, err => {        
        reject(err);
      });
    });
  });

      
}

  
  fblogin(){
    return new Promise((resolve,reject) => {
      console.log("awri.fblogin()");
      
      openFB.login(
        function(response) {
          if (response.status === 'connected') {


         resolve(response);          
          }
          else if (response.error) { 
          reject(response.error);
           }
        },
        { scope: "email" });        
  });

 }

register(username:String,password:String,email:String){
console.log('USER REGISTER'+username);
return new Promise((resolve,reject) => {
   
  let headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('X-CSRF-TOKEN', <string>this.token); 
  
  let options = {
      headers: headers,
      withCredentials: true 
  }; 
  let user ={
    mail:email,
    name:username,
    pass:password
  }

      this.http.post(this.HOST+'/?q=drupalgap/user/register',user,options).map(res=>res).subscribe(data => {         
        console.log(data);
        let vars=<any>data;
        this.user.uid=vars.uid;
        console.log(vars.uri);
        console.log(this.user.uid);      
      
        this.checkUser();
      }, err => {
        reject(err);
      });      
      

 //     console.log(this.token);


});

}


 fboauth(token:String){
  return new Promise((resolve,reject) => {
  let headers = new HttpHeaders()
  //.set('Content-Type', 'application/json')
  .set('X-CSRF-TOKEN', <string>this.token);  
  let options = {
      headers: headers,
      withCredentials: true 
  }; 
  let params ={
    access_token:token,
  }

    //console.log(headers);
      this.http.post(this.HOST+'/?q=drupalgap/fboauth/connect.json',params,options).map(res=>res).subscribe(data => {         
        console.log(data);
        let vars=<any>data;
        this.token=vars.token;
        this.session=vars.session_name+'='+vars.sessid;
      //  this.user=vars.user;
        this.user.uid=vars.user.uid;
        this.user.roles=vars.user.roles;
        this.user.name=vars.user.name;
        if(vars.user.picture)this.user.picture=vars.user.picture.url;
        
        if(vars.user.field_fbid['und'])this.user.fbid=vars.user.field_fbid['und'][0].value;
        if(this.user.fbid)this.user.picture="https://graph.facebook.com/"+this.user.fbid+"/picture"
        console.log(this.user.fbid,"FBID");
     //   console.log(data.session_name+''+data.sessid);
        console.log(this);
        resolve(data);
      }, err => {
        console.log(err);
        reject(err);
      });      
 //     console.log(this.token);
});  
}


  login(username:any,password:any){
  
    return new Promise((resolve,reject) => {
   
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('X-CSRF-TOKEN', <string>this.token); 
    
    let options = {
        headers: headers,
        withCredentials: true 
    }; 

    const user ={
      username:username,
      password:password
    }

      //console.log(headers);
      
        this.http.post(this.HOST+'/?q=drupalgap/user/login',user,options).map(res=>res).subscribe(data => {         
          console.log(data);
          let vars=<any>data;
         this.token=vars.token;
          this.session=vars.session_name+'='+vars.sessid;
      //    this.user=vars.user;
          this.set('session_name',vars.session_name);
          this.set('sessid',vars.token);

          this.user.uid=vars.user.uid;
          this.user.roles=vars.user.roles;
          if(this.user.uid>0){
            this.user.name=vars.user.name;
     
            if(vars.user.field_fbid['und'])this.user.fbid=vars.user.field_fbid['und'][0].value;
            if(this.user.fbid)this.user.picture="https://graph.facebook.com/"+this.user.fbid+"/picture";
            if(vars.user.picture) this.user.picture=vars.user.picture.url;
            console.log(this.user.fbid,"FBID");
          }
            console.log(this.session);
          console.log(this.user.uid);
          resolve(data);
        }, err => {
          if(err.status==401)this.showError("Falscher Benutzername oder falsches Passwort!");
          else this.showError("Anmeldung fehlgeschlagen:"+err.status);
          reject(err);
        });      
  });

  }

  getPlatform(){
  return this.plt.platforms();
    }

  connect(){
    return new Promise((resolve,reject) => {
      const headers = new HttpHeaders()
        .set('X-CSRF-TOKEN',<any>this.token)
      const options = {
        headers: headers,
        withCredentials: true
      };    
        this.http.post(this.HOST+'/?q=drupalgap/system/connect',null,options).map(res=>res).subscribe(data => {         
          console.log(data);
          let vars=<any>data;
          this.token=vars.token;
          this.session=vars.session_name+'='+vars.sessid;
          this.user.uid=vars.user.uid;
          if(this.user.uid>0)this.user.name=vars.user.name;
          resolve(data);
        }, err => {
          reject(err);
      });            
    });
  }
/*
  search<items>(text:any){
    console.log("suche.....");
    this.http.get('https://awri.ch/drupalgap/search_node/retrieve.json?keys='+text).subscribe(data => {

      this.items=data;

      //console.log(this.items);
      return this.items;
      
    });

  }
*/

  search(text:String) {
    return new Promise((resolve,reject) => {
      this.showLoading("Suche, Bitte warten...");
      const headers = new HttpHeaders()
      .set('X-CSRF-TOKEN',<any>this.token);    
    const options = {
      headers: headers,
      withCredentials: true
    };
      this.http.get(this.HOST+'/drupalgap/search_node/retrieve.json?keys='+text,options).subscribe(data => {
        this.items=<Array<any>>data;
     //   var view=this.data.view;      
      //  this.page=view.page;
      //  this.pages=view.pages; 
      this.hideLoading(); 
       resolve(this.items);

      }, err => {
        this.hideLoading(); 
        reject(err);
      });
    });
  }


  
  
getToken(){
  return new Promise((resolve,reject) => {
      this.http.get(this.HOST+'/?q=services/session/token', { responseType: 'text' }).map(res=>res).subscribe(data=> {
        this.token=data;
          console.log(data);
        resolve(data);     
      },err=>{
        reject(err);
      })
  })   
}

getKantons(){
  return new Promise((resolve,reject) => {
    const headers = new HttpHeaders().set('X-CSRF-TOKEN',<any>this.token);    
    const options = {
      headers: headers,
      withCredentials: true
    };
      this.http.get(this.HOST+'/drupalgap/taxonomy_term?page=0&fields=vid,name&&parameters[vid]=3&pagesize=27&options[orderby][weight]=asc',options).subscribe(data=> {
        resolve(data);     
      },err=>{
        reject(err);
      })
  })
}


 createFrage(data){
    return new Promise((resolve,reject) => {
      const headers = new HttpHeaders()
      .set('X-CSRF-TOKEN',<any>this.token).set('Content-Type','application/json');    
    const options = {
      headers: headers,
      withCredentials: true
    };
       
 //console.log(JSON.stringify(data));
    this.http.post(this.HOST+'/connect/awri_fragen',JSON.stringify(data),options).subscribe(data=> {
    resolve(data);       
     },err=>{
       reject(err);
     })
    })
    }

    
authRequest(){
  return new Promise(resolve => {
  let headers = new HttpHeaders()
  .set('X-CSRF-TOKEN',<string>this.token).set('Content-Type', 'application/json')
  .set('Authentication', <string>this.session);
  //.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
 // .set('Access-Control-Allow-Headers', 'Content-Type,X-CSRF-TOKEN');

let options:any = {
  headers: headers,
  withCredentials	: 'true',
};

  this.http.get(this.HOST+'/?q=drupalgap/user/'+this.user.uid+'.json', options).subscribe(data => {
  let res:any=data;  
  console.log(res);
  this.user.name=res.name;
   //  resolve(data);
   })
 

headers = new HttpHeaders()
  .set('X-CSRF-TOKEN',<string>this.token).set('Content-Type', 'application/json')
 
options = {
  headers: headers,
  withCredentials	: true,
};
   this.http.post(this.HOST+'/?q=drupalgap/awri_services_resources/rechtsfrage',{nid:'18580'}, options).map(res=>res[0]).subscribe(data => {
    let res:any=data;  
    console.log(JSON.parse(res));
       resolve(data);    
    });
  });
}
 

loadNode(nid){
  return new Promise((resolve,reject) => {
  let headers = new HttpHeaders()
  .set('X-CSRF-TOKEN',<string>this.token).set('Content-Type', 'application/json');
let options:any = {
  headers: headers,
  withCredentials	: true
};
 
   this.http.get(this.HOST+'/?q=drupalgap/node/'+nid+'.json', options).subscribe(data => {
  //  let res:any=data;  
    //console.log(JSON.parse(res));
       resolve(data);    
    },err=>{
       reject(err);
    });
  });
  
}

logout() {    
  return new Promise((resolve,reject) => {
    const headers = new HttpHeaders()
.set('X-CSRF-TOKEN',<any>this.token).set('Content-Type', 'application/json')

const options = {
headers: headers,
withCredentials	: true,
};

this.http.post(this.HOST+'/drupalgap/user/logout.json',null,options).subscribe(data => {
      console.log(data);
     // let res:any=data;
     this.user={
      uid:0,
      name:'Unbekannt',
      email:'',
      picture:'assets/imgs/anonymous.png',
      roles:[{0:'anonymous user'}],
      created:Date.now(),
      fbid:0
    }; 
      console.log(data);
      resolve(data);
    }, err => {
      console.log(err);
      reject(err);
    });
  });
}
uploadFile(filedata){
  return new Promise((resolve,reject) => {
  const headers = new HttpHeaders()
  .set('X-CSRF-TOKEN',<any>this.token).set('Content-Type', 'application/json')
  const options = {
  headers: headers,
  withCredentials	: true,
  };
  this.http.post(this.HOST+'/drupalgap/file.json',filedata,options).subscribe(data => {
    console.log(data);

    resolve(data);
  }, err => {
    reject(err);
  });
});
}

resetPassword(){
  return new Promise((resolve,reject) => {
    const headers = new HttpHeaders()
    .set('X-CSRF-TOKEN',<any>this.token).set('Content-Type', 'application/json')
    const options = {
    headers: headers,
    withCredentials	: true,
    };
    this.http.get(this.HOST+'/drupalgap/user/password',options).subscribe(data => {
      console.log(data);
  
      resolve(data);
    }, err => {
      reject(err);
    });
  });
}


resetSearch(){
  //alert("reset");
  this.items=null;
 // console.log(this.items);

}
  getItems(){
    return this.items;
  }
  
  getName(){
    return this.user.name;
  }

  getInfo(){
    alert("Clicked INFO");
  }


  isLoggedIn(){
    if(this.user.uid>0)return true;
    else return false;
  }

isBrowser(){
  if(this.plt.is('core') || this.plt.is('mobileweb'))return true;
  else return false; 
}
 

isAdmin(){
let ret=false;
  let obj=this.user.roles;
    Object.keys(obj).forEach(function(key,index) {
      if(obj[key]=='administrator'||obj[key]=='moderator')ret=true;
      // key: the name of the object key
      // index: the ordinal position of the key within the object 
  });
return ret;
  }

  isInRole(role){
    let ret=false;
    let obj=this.user.roles;
      Object.keys(obj).forEach(function(key) {
        if(obj[key]===role)ret=true;
    });
  return ret;
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
 
showError(msg){
  let alert = this.alertCtrl.create({
    title: 'Fehler',
    message: msg,
    buttons: ['Weiter']
  });
  alert.present();
}


}
