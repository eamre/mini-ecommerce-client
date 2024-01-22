import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClientService: HttpClientService) { }

  userRoles:string[] = []

  async getRoles(page:number=0, size:number=5, successCallBack?:()=>void, errorCallBack?:(errorMessage:string)=>void){
    const observable: Observable<any> = this.httpClientService.get({
      controller:"roles",
      queryString:`Pagination.page=${page}&Pagination.size=${size}`
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack).catch(errorCallBack)

    return await promiseData
  }

  async create(name: string, successCallBack?: ()=> void, errorCallBack?:(error: any)=> void){
    const observable: Observable<any> = this.httpClientService.post({
      controller:"roles",
    },{name});

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack).catch(errorCallBack)

    return await promiseData as {succeeded: boolean}
  }

  hasRole(role: string):boolean {
    const token = localStorage.getItem('accessToken');
    const decoded = jwtDecode(token);
    this.userRoles = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return  role === '' || this.userRoles.includes(role);
  }
}
