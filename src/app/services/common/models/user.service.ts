import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from 'src/app/entities/user';
import { CreateUserResponse } from 'src/app/contracts/users/create_user';
import { Observable, firstValueFrom } from 'rxjs';
import { Token } from 'src/app/contracts/token/token';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { SocialUser } from '@abacritt/angularx-social-login';

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

  async googleLogin(user:SocialUser, cb?:() => void):Promise<any>{
    const googleLoginObservable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      controller:"users",
      action:"GoogleLogin"
    }, user);
    const tokenReponse: TokenResponse = await firstValueFrom(googleLoginObservable) as TokenResponse;
    if (tokenReponse) {
      localStorage.setItem("accessToken", tokenReponse.token.accessToken);
      this.toastrService.message("Google Üzerinden Giriş Başarıyla Sağlandı", "Giriş Başarılı",{
        messageType:ToastrMessageType.Success,
        position:ToastrPosition.TopRight
      })
    }
    cb()
  }

  async facebookLogin(user: SocialUser, cb?:()=> void):Promise<any>{
    const facebookLoginObservable:Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      controller:"users",
      action:"facebooklogin"
    },user);

    const tokenReponse: TokenResponse = await firstValueFrom(facebookLoginObservable) as TokenResponse
    if(tokenReponse){
      localStorage.setItem("accessToken",tokenReponse.token.accessToken);
      this.toastrService.message("Facebook Üzerinden Giriş Başarıyla Sağlandı", "Giriş Başarılı",{
        messageType:ToastrMessageType.Success,
        position:ToastrPosition.TopRight
      });
    }
    cb();
  }
}
