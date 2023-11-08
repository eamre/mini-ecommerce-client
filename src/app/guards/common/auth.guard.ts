import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { SpinnerType } from 'src/app/base/base.component';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private jwtHelper: JwtHelperService,
    private router: Router,
    private toastrService: CustomToastrService,
    private spinner: NgxSpinnerService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.spinner.show(SpinnerType.BallAtom)
    let token: string = localStorage.getItem("accessToken");
    let expired: boolean;
    try {
      expired = this.jwtHelper.isTokenExpired(token)
      let decode = this.jwtHelper.decodeToken(token)
    } catch (error) {
      expired = true
    }

    if (!token || expired) {
      this.toastrService.message("Oturum açmanız gerekiyor","Yetkisiz Erişim",{
        messageType: ToastrMessageType.Warning,
        position:ToastrPosition.TopRight
      })
      this.router.navigate(["login"],{queryParams:{return:state.url}})
      this.spinner.hide(SpinnerType.BallAtom)
      return false;
    }
    this.spinner.hide(SpinnerType.BallAtom)
    return true;
  }

}
