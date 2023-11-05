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
    const userObservable: Observable<CreateUserResponse | User> = this.httpClientService.post<CreateUserResponse | User>({
      controller:"Users",
    },user);

    return await firstValueFrom(userObservable) as CreateUserResponse;
  }

}
