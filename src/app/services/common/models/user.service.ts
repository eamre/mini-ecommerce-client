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



  // async facebookLogin(user: SocialUser, cb?:()=> void):Promise<any>{
  //   const facebookLoginObservable:Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
  //     controller:"users",
  //     action:"facebooklogin"
  //   },user);

  //   const tokenReponse: TokenResponse = await firstValueFrom(facebookLoginObservable) as TokenResponse
  //   if(tokenReponse){
  //     localStorage.setItem("accessToken",tokenReponse.token.accessToken);
  //     this.toastrService.message("Facebook Üzerinden Giriş Başarıyla Sağlandı", "Giriş Başarılı",{
  //       messageType:ToastrMessageType.Success,
  //       position:ToastrPosition.TopRight
  //     });
  //   }
  //   cb();
  // }
}
