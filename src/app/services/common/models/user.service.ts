import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from 'src/app/entities/user';
import { CreateUserResponse } from 'src/app/contracts/users/create_user';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService) {
  }

  async create(user:User):Promise<CreateUserResponse>{
    const createUserObservable: Observable<CreateUserResponse | User> = this.httpClientService.post<CreateUserResponse | User>({
      controller:"Users",
    },user);

    return await firstValueFrom(createUserObservable) as CreateUserResponse;
  }

  async login(usernameOrEmail: string, password:string, cb?:()=>void):Promise<void>{
    const loginUserObservable:Observable<any> = this.httpClientService.post({
      controller:"users",
      action:"login"
    },{usernameOrEmail,password})

    return await firstValueFrom(loginUserObservable)
    cb();
  }

}
