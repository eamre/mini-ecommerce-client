import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
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
          console.log('user');
          this.showSpinner(SpinnerType.BallAtom);
          await this.userService.googleLogin(user, () => {
            this.hideSpinner(SpinnerType.BallAtom);
            this.authService.identityCheck();
            this.activatedRoute.queryParams.subscribe((params) => {
              const returnUrl: string = params['return'];
              if (returnUrl) {
                this.router.navigate([returnUrl]);
              }
            });
          });
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

  async googleLogin() {
    console.log("ah");

  }
}
