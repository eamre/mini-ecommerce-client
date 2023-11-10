import { Component } from '@angular/core';
import { AuthService } from './services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
declare var $: any
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ETicaretClient';
  constructor(
    public authService: AuthService,
    private toastrService:CustomToastrService,
    private router: Router,
    private socialAuthService: SocialAuthService)
  {
    authService.identityCheck();
  }

  signOut(){
    this.socialAuthService.signOut().catch((a)=>{
      "çikiş başarisiz"+a
    });
    localStorage.removeItem("accessToken")
    this.authService.identityCheck()
    this.router.navigate([""])
    this.toastrService.message("Oturum kapatıldı","",{
      messageType:ToastrMessageType.Success,
      position:ToastrPosition.TopRight
    })
  }
}
