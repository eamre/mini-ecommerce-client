import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from 'src/app/entities/user';
import { CreateUserResponse } from 'src/app/contracts/users/create_user';
import { Observable, firstValueFrom } from 'rxjs';
import { Token } from 'src/app/contracts/token/token';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';

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

  async login(usernameOrEmail: string, password:string, cb?:()=>void):Promise<any>{
    const loginUserObservable:Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller:"users",
      action:"login"
    },{usernameOrEmail,password})

    const tokenReponse: TokenResponse = await firstValueFrom(loginUserObservable) as TokenResponse;

    if(tokenReponse){
      localStorage.setItem("accessToken",tokenReponse.token.accessToken);
      
      this.toastrService.message("Kullanıcı girişi başariyla sağlandi","Giriş başarili",{
        messageType:ToastrMessageType.Success,
        position:ToastrPosition.TopRight
      })
    }
    cb();
  }

}
