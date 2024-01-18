import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from 'src/app/entities/user';
import { CreateUserResponse } from 'src/app/contracts/users/create_user';
import { Observable, firstValueFrom } from 'rxjs';
import { Token } from 'src/app/contracts/token/token';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { SocialUser } from '@abacritt/angularx-social-login';
import { error } from 'console';
import { ListUser } from 'src/app/contracts/users/list_user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService,
    private toastrService : CustomToastrService) {
  }

  async create(user:User):Promise<CreateUserResponse>{
    const createUserObservable: Observable<CreateUserResponse | User> = this.httpClientService.post<CreateUserResponse | User>({
      controller:"Users",
    },user);

    return await firstValueFrom(createUserObservable) as CreateUserResponse;
  }

  async updatePassword(userId:string, resetToken:string, password:string, passwordConfirm:string, successCb?:()=> void, errorCb?:(error)=>void){
    const observable:Observable<any> = this.httpClientService.post({
      action:"UpdatePassword",
      controller:"users"
    },{userId, resetToken, password, passwordConfirm})

    const promiseData:Promise<any> = firstValueFrom(observable)
    promiseData.then(value => successCb()).catch(error => errorCb(error))
    await promiseData
  }

  async getAllUsers(page:number=0, size:number=5, successCallBack?:()=>void,
  errorCallBack?:(errorMessage:string)=>void):Promise<{totalUsersCount:number,users:ListUser[]}>{
    const observable:Observable<{totalUsersCount:number,users:ListUser[]}> = this.httpClientService.get({
      controller:"users",
      queryString:`Pagination.page=${page}&Pagination.size=${size}`
    })
    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
    .catch(error => errorCallBack(error))
    return await promiseData
  }

  async assignRoleToUser(id: string, roles: string[], successCB?:()=> void, errorCB?:(error)=> void){
    const observable:Observable<any> = this.httpClientService.post({
      controller:"users",
      action:"AssignRoleToUser"
    }, {userId:id, roles});

    const promiseData = firstValueFrom(observable);
    promiseData.then(()=>successCB()).catch(error => errorCB(error))

    await promiseData;
  }

  async getRolesOfUser(userId: string, successCB?:()=> void, errorCB?:(error)=> void):Promise<string[]>{
    const observable:Observable<{userRoles:string[]}> = this.httpClientService.get({
      controller:"users",
      action:"GetRolesToUser"
    },userId);

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCB)
      .catch(errorCB)

    return (await promiseData).userRoles;
  }

}
