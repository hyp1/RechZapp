import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
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

@Injectable()
export class AwriConnectProvider {
public uid:Number;
public username:String;
public session:String;
public token:String;

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



  constructor(public http: HttpClient) {
    this.uid=-1;
    this.username='Unbekannt';
    this.session=null;
    this.token=null;
    this.items=[];
    /*
    this.items = [
      {
        id: 'A1',
        action: 0,
        points: 0,
        label: 'L1',
        link: 'Li1',
        snippet: 'SN1'
      },
      {
        id: 'A2',
        action: 0,
        points: 0,
        label: 'L2',
        link: 'Li2',
        snippet: 'SN2'

      },
      {
        id: 'A3',
        action: 0,
        points: 0,
        label: 'L3',
        link: 'Li3',
        snippet: 'SN3'

      },
    ];
    */
    //console.log(this.items);
    console.log('Hello AwriConnectProvider Provider');
  }

  login(username:any,password:any){
    return new Promise(resolve => {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
   // .set('X-CSRF-TOKEN', token); 
    
    let options = {
        headers: headers
    }; 
    let user ={
      username:username,
      password:password
    }


      //console.log(headers);
        this.http.post('https://awri.ch/?q=drupalgap/user/login',user,options).map(res=>res).subscribe(data => {         
          console.log(data);
          let vars=<any>data;
          this.token=vars.token;
          this.session=vars.session_name+'_'+vars.sessid;
          this.uid=vars.user.uid,
          this.username=vars.user.name,
       //   console.log(data.session_name+''+data.sessid);
       //   console.log(this.uid);
          resolve(this);
        }, err => {
          console.log(err);
        });      
   //     console.log(this.token);
  });  
  }


  connect(){
    console.log("CPV connect");
 /*
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
   // .set('X-CSRF-TOKEN', token); 
    
    let options = {
        headers: headers
    }; 

   
      //console.log(headers);
        this.http.post('https://awri.ch/?q=drupalgap/system/connect',null,options).subscribe(data => {
        this.session=data.session_name+'_'+data.sessid;
        this.uid=data.user.uid;  
        this.token=data.token;  
        console.log(data);
          console.log(data.session_name+'_'+data.sessid);
          console.log(this);
        });
        */
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
    return new Promise(resolve => {
      this.http.get('https://awri.ch/drupalgap/search_node/retrieve.json?keys='+text).subscribe(data => {
        this.items=<any[]>data;

     //   var view=this.data.view;      
      //  this.page=view.page;
      //  this.pages=view.pages;  
       resolve(this.items);

      }, err => {
        console.log(err);
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

}
