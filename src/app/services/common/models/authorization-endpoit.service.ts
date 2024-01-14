import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationEndpoitService {

  constructor(private httpClientService:HttpClientService) { }

  async assignRoleEndpoint(roles: string[], code: string, menu: string, successCB?:()=> void, errorCB?:(error)=> void){
    const observable:Observable<any> = this.httpClientService.post({
      controller:"AuthorizationEndpoints",
    }, {roles:roles, code:code, menu:menu});

    const promiseData = observable.subscribe({
      next:successCB,
      error: errorCB
    })

    await promiseData;
  }

  async getRolesOfEndpoint(code: string, menu: string, successCB?:()=> void, errorCB?:(error)=> void):Promise<string[]>{
    const observable:Observable<any> = this.httpClientService.post({
      controller:"AuthorizationEndpoints",
      action:"get-roles-to-endpoint"
    }, {code, menu});

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCB)
      .catch(errorCB)

    return (await promiseData).roles;
  }

}
