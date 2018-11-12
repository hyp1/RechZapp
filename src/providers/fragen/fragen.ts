import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the FragenProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FragenProvider {
  private items:Array<any>;
  page:number;
  pages:number;
  fragen:Array<any>;
  constructor(public http: HttpClient) {
    this.page=0;
    this.pages=10;
    this.fragen=[];
    console.log('Hello FragenProvider Provider');
  }

getFragen(){}

}
