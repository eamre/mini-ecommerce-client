import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/common/auth.service';
import { HttpClientService } from './services/common/http-client.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from './services/ui/custom-toastr.service';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ETicaretClient';
  constructor(
    public authService: AuthService,
    private toastrService: CustomToastrService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private httpClientService: HttpClientService
  ) {
    authService.identityCheck();
  //   httpClientService
  //     .get({
  //       controller: 'baskets',
  //     })
  //     .subscribe((data) => {});
   }

  signOut() {
    this.socialAuthService.signOut().catch((a) => {
      'çikiş başarisiz' + a;
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem("refreshToken")
    this.authService.identityCheck();
    this.router.navigate(['']);
    this.toastrService.message('Oturum kapatıldı', '', {
      messageType: ToastrMessageType.Success,
      position: ToastrPosition.TopRight,
    });
  }
}
