import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { AuthService } from 'src/app/services/common/auth.service';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit {
  private authStateSubscription: Subscription;

  constructor(
    private userService: UserService,
    spinner: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {
    super(spinner);
  }

  ngOnInit(): void {
    this.authStateSubscription = this.socialAuthService.authState.subscribe(
      async (user: SocialUser) => {
        if (user) {
          console.log(user);
          this.showSpinner(SpinnerType.BallAtom);
          switch (user.provider) {
            case 'GOOGLE':
              await this.userService.googleLogin(user, () => {
                this.loginCallBack();
              });
              break;
            case 'FACEBOOK':
              await this.userService.facebookLogin(user, () => {
                this.loginCallBack();
              });
              break;
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.authStateSubscription.unsubscribe();
  }

  async login(usernameOrEmail: string, password: string) {
    this.showSpinner(SpinnerType.BallAtom);
    await this.userService.login(usernameOrEmail, password, () => {
      this.authService.identityCheck();
      this.activatedRoute.queryParams.subscribe((params) => {
        const returnUrl: string = params['return'];
        if (returnUrl) {
          this.router.navigate([returnUrl]);
        }
      });
      this.hideSpinner(SpinnerType.BallAtom);
    });
  }

  facebookLogin(){
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
  }

  loginCallBack(){
    this.authService.identityCheck();
    this.hideSpinner(SpinnerType.BallAtom);
    this.activatedRoute.queryParams.subscribe((params) => {
      const returnUrl: string = params['return'];
      if (returnUrl) {
        this.router.navigate([returnUrl]);
      }
    });
  }
}
