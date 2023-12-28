import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AlertifyService, MessagePosition, MessageType } from 'src/app/services/admin/alertify.service';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private userAuthService:UserAuthService,
    private activatedRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private userService:UserService,
    private router:Router) {
    super(spinner);
  }

  state:any;

  ngOnInit(): void {
    this.showSpinner(SpinnerType.BallAtom)
    this.activatedRoute.params.subscribe({
      next: async params =>{
        const userId: string = params["userId"];
        const resetToken: string = params["resetToken"];
        this.state = await this.userAuthService.verifyResetToken(resetToken,userId,()=>{
          this.hideSpinner(SpinnerType.BallAtom)
        })
      }
    })
  }

  updatePassword(password: string, passwordConfirm: string) {
    this.showSpinner(SpinnerType.BallAtom);
    if (password != passwordConfirm) {
      this.hideSpinner(SpinnerType.BallAtom)
      this.alertify.message("şifreler aynı değil", { messageType: MessageType.Error, position: MessagePosition.TopRight })
      return;
    }
    this.activatedRoute.params.subscribe({
      next: async params => {
        const userId: string = params["userId"];
        const resetToken: string = params["resetToken"];
        await this.userService.updatePassword(userId, resetToken, password, passwordConfirm,
          () => {
            this.hideSpinner(SpinnerType.BallAtom)
            this.alertify.message("şifre günco", { messageType: MessageType.Success, position: MessagePosition.TopRight })
            this.router.navigate(["/login"])
          },
          error => {
            this.hideSpinner(SpinnerType.BallAtom)
            console.log(error);
          })
      }
    })
  }
}
