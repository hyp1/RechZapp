import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Platform } from 'ionic-angular/platform/platform';

//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
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
public  HOST='https://stage.awri.ch'

public uid:Number;
public username:String;
public userpic:String;
public roles:Array<String>;
public session:String;
public token:String;

public fbid:Number;
public access_token:String;

private items:Array<any>;
/*
public items: [{
  id: string;
  action: number;
  points: number;
  label: string;
  link: string;

}];
*/
  constructor(public http: HttpClient,public storage: Storage,private plt:Platform,private alertCtrl:AlertController) {
    
    this.uid=0;
    this.username='Unbekannt';
    this.userpic='assets/imgs/anonymous.png';

    this.roles=['anonymous user'];
    this.session=null;
    this.token=null;
    this.items=null;
    this.access_token=null;
    //openFB.init({appId:'126766317359254',scope:'email'});
    //console.log(openFB),
    this.getUser().then(data=>{
      console.log(data);
    },err=>{
      console.log(err);
    });
    
    
    console.log('Hello AwriConnectProvider Provider');
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
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }



getComments(nid){
  return new Promise(resolve=>{
   this.http.get('https://awri.ch/drupalgap/comment.json?parameters[nid]='+nid+'&parameters[status]=1&pagesize=150').subscribe(data=>{
resolve(data);
  });
  
})
 
}

  loadUser(uid){
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
  
    this.http.get(this.HOST+'/?q=drupalgap/user/'+uid+'.json', options).subscribe(data => {
 
    resolve(data);
     })
    })
    }


    
  getUser() {
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
      this.uid=dat.user.uid;
      this.roles=dat.user.roles;
      this.set('session_name',dat.session_name);
      this.set('sessid',dat.sessid);      
      this.session=dat.session_name+'='+dat.sessid;
      if(this.uid>0){
        this.username=dat.user.name;      
     
      this.loadUser(this.uid).then(data=>{
        let vars:any=data;  
        this.username=vars.name;
        this.uid=vars.uid;
        this.roles=vars.roles;        
        if(this.uid>0){
         // this.username=vars.user.name;
          if(vars.picture) this.userpic=vars.picture.url;
          if(vars.field_fbid['und'])this.fbid=vars.field_fbid['und'][0].value;
          if(this.fbid)this.userpic="https://graph.facebook.com/"+this.fbid+"/picture"     
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
        this.uid=vars.uid;
        console.log(vars.uri);
        console.log(this.uid);      
        resolve(data)

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
      headers: headers
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
        this.uid=vars.user.uid;
        this.roles=vars.user.roles;
        this.username=vars.user.name;
        if(vars.user.picture)this.userpic=vars.user.picture.url;
        
        if(vars.user.field_fbid['und'])this.fbid=vars.user.field_fbid['und'][0].value;
        if(this.fbid)this.userpic="https://graph.facebook.com/"+this.fbid+"/picture"
        console.log(this.fbid,"FBID");
     //   console.log(data.session_name+''+data.sessid);
     //   console.log(this.uid);
        resolve(data);
      }, err => {
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

          this.uid=vars.user.uid;
          this.roles=vars.user.roles;
          if(this.uid>0){
            this.username=vars.user.name;
            if(vars.user.picture) this.userpic=vars.user.picture.url;
            if(vars.user.field_fbid['und'])this.fbid=vars.user.field_fbid['und'][0].value;
            if(this.fbid)this.userpic="https://graph.facebook.com/"+this.fbid+"/picture"
            console.log(this.fbid,"FBID");
          }
            console.log(this.session);
          console.log(this.uid);
          resolve(data);
        }, err => {
          reject(err);
        });      
        
   //     console.log(this.token);


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
    this.uid=vars.user.uid;
   if(this.uid>0)this.username=vars.user.name;
 //   console.log(data.session_name+''+data.sessid);
 //   console.log(this.uid);
    resolve(data);
  }, err => {
    reject(err);
  });      
  
//});

/*
      //console.log(headers);
        this.http.get('https://awri.ch/?q=services/session/token',options).subscribe(data => {
         // let vars=<string>data;
         // this.token=vars;
      //    this.session=vars.session_name+'_'+vars.sessid;
      //    this.uid=vars.user.uid,
      //    this.username=vars.user.name,
        console.log(data);
        resolve(this);
         // console.log(vars.session_name+'_'+vars.sessid);
        
        });
        */
      
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
       resolve(this.items);

      }, err => {
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
  

  //JSON.stringify(data);       
  console.log(JSON.stringify(data));
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

  this.http.get(this.HOST+'/?q=drupalgap/user/'+this.uid+'.json', options).subscribe(data => {
  let res:any=data;  
  console.log(res);
  this.username=res.name;
   //  resolve(data);
   })
 
   
 // headers = new HttpHeaders()
 //  .set('X-CSRF-TOKEN',<string>this.token).set('Content-Type', 'application/json');
   //set('Cookie', <string>this.session);
  //  options = {
  //  headers: headers,
   // withCredentials	: 'true',
  //};

headers = new HttpHeaders()
  .set('X-CSRF-TOKEN',<string>this.token).set('Content-Type', 'application/json')
  //.set('Authentication', <string>this.session);
  //.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
 // .set('Access-Control-Allow-Headers', 'Content-Type,X-CSRF-TOKEN');

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
      this.uid=0;
      this.username='Unbekannt';
      this.roles=['anonymous user'];   
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

  getItems(){
    return this.items;
  }
  
  getName(){
    return this.username;
  }

  getInfo(){
    alert("Clicked INFO");
  }


  isLoggedIn(){
    if(this.uid>0)return true;
    else return false;
  }

isBrowser(){
  if(this.plt.is('core') || this.plt.is('mobileweb'))return true;
  else return false; 
}
 

isAdmin(){
let ret=false;
  let obj=this.roles;
    Object.keys(obj).forEach(function(key,index) {
      if(obj[key]=='administrator')ret=true;
      // key: the name of the object key
      // index: the ordinal position of the key within the object 
  });
return ret;
  }

  isInRole(role){
    let ret=false;
    let obj=this.roles;
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
