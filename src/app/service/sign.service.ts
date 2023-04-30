import { Injectable } from '@angular/core';
import { Sign } from '../model/sign';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SignService extends GenericService<Sign>{

  //private url: string = `${environment.HOST}/signs`;

  //VARIABLE REACTIVA
  private signChange = new Subject<Sign[]>;
  private messageChange = new Subject<string>;


  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/signs`)
  }

  listPageable(p: number, s: number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  setSignChange(data: Sign[]){
    this.signChange.next(data);
  }

  getSignChange(){
    return this.signChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
