import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { Observable, firstValueFrom } from 'rxjs';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private httpClientService: HttpClientService,
    private toastrService : CustomToastrService) { }

  async refreshTokenLogin(refreshToken:string, cb?:(state)=>void):Promise<any>{
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      action:"RefreshTokenLogin",
      controller:"auth"
    },{refreshToken})
    try {
      const tokenReponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;
      if(tokenReponse){
        localStorage.setItem("accessToken",tokenReponse.token.accessToken);
        localStorage.setItem("refreshToken",tokenReponse.token.refreshToken);
      }
      cb(tokenReponse ? true:false);
    } catch (error) {
      cb(false);
    }
  }

  async login(usernameOrEmail: string, password:string, cb?:()=>void):Promise<any>{
    const loginUserObservable:Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller:"auth",
      action:"login"
    },{usernameOrEmail,password})
    const tokenReponse: TokenResponse = await firstValueFrom(loginUserObservable) as TokenResponse;
    if(tokenReponse){
      localStorage.setItem("accessToken",tokenReponse.token.accessToken);
      localStorage.setItem("refreshToken",tokenReponse.token.refreshToken);
      this.toastrService.message("Kullanıcı girişi başariyla sağlandi","Giriş başarili",{
        messageType:ToastrMessageType.Success,
        position:ToastrPosition.TopRight
      })
    }
    cb();
  }

  async googleLogin(user:SocialUser, cb?:() => void):Promise<any>{
    const googleLoginObservable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      controller:"auth",
      action:"GoogleLogin"
    }, user);
    const tokenReponse: TokenResponse = await firstValueFrom(googleLoginObservable) as TokenResponse;
    if (tokenReponse) {
      localStorage.setItem("accessToken", tokenReponse.token.accessToken);
      localStorage.setItem("refreshToken",tokenReponse.token.refreshToken);
      this.toastrService.message("Google Üzerinden Giriş Başarıyla Sağlandı", "Giriş Başarılı",{
        messageType:ToastrMessageType.Success,
        position:ToastrPosition.TopRight
      })
    }
    cb()
  }

  async facebookLogin(user: SocialUser, cb?:()=> void):Promise<any>{
    const facebookLoginObservable:Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      controller:"auth",
      action:"facebooklogin"
    },user);
    const tokenReponse: TokenResponse = await firstValueFrom(facebookLoginObservable) as TokenResponse
    if(tokenReponse){
      localStorage.setItem("accessToken",tokenReponse.token.accessToken);
      localStorage.setItem("refreshToken",tokenReponse.token.refreshToken);
      this.toastrService.message("Facebook Üzerinden Giriş Başarıyla Sağlandı", "Giriş Başarılı",{
        messageType:ToastrMessageType.Success,
        position:ToastrPosition.TopRight
      });
    }
    cb();
  }

  async passwordReset(email:string, cb?:()=>void){
    const observable:Observable<any>=this.httpClientService.post({
      controller:"auth",
      action:"PasswordReset"
    },{email})

    await firstValueFrom(observable)
    cb()
  }

  async verifyResetToken(resetToken: string, userId: string, cb?: ()=> void):Promise<boolean>{
    const observable:Observable<any>=this.httpClientService.post({
      controller:"auth",
      action:"VerifyResetToken"
    },{resetToken, userId})

    const state:boolean = await firstValueFrom(observable)
    cb()
    return state;
  }
}
