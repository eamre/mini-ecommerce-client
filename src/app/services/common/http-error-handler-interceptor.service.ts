import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { Observable, catchError, of } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';
import { UserAuthService } from './models/user-auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {

  constructor(private toastrService: CustomToastrService,
    private userAuthService: UserAuthService,
    private router: Router,
    private spinner:NgxSpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => {
      switch (error.status) {
        case HttpStatusCode.Unauthorized:
          this.userAuthService.refreshTokenLogin(localStorage.getItem("refreshToken"),(state)=>{
            if(!state){
              let url = this.router.url; //"/product"
              if(url == "/products")
                this.toastrService.message("Sepete Ürün Eklemek için Oturum Açın","Oturun Aç Bea",{messageType:ToastrMessageType.Warning,position:ToastrPosition.TopRight})
              else
                this.toastrService.message("Bu işlemi yapmaya yetkiniz yok", "Yetkisiz İşlem",{messageType:ToastrMessageType.Warning, position:ToastrPosition.TopRight})
            }
          }).then(data => {this.toastrService.message("Bu işlemi yapmaya yetkiniz yok", "Yetkisiz İşlem",{messageType:ToastrMessageType.Warning, position:ToastrPosition.TopRight})
        });
          break;
        case HttpStatusCode.InternalServerError:
          this.toastrService.message("Sunucuya Erişilemiyor", "Sunucu Hatası",{messageType:ToastrMessageType.Warning, position:ToastrPosition.TopRight})
          break;
        case HttpStatusCode.BadRequest:
          if(localStorage.getItem("refreshToken"))
            this.toastrService.message("Geçersiz İstek Yapıldı", "Geçersiz İstek",{messageType:ToastrMessageType.Warning, position:ToastrPosition.TopRight})
          break;
        case HttpStatusCode.NotFound:
          this.toastrService.message("Maalesef Bulunamadı", "Yok Yani",{messageType:ToastrMessageType.Warning, position:ToastrPosition.TopRight})
          break;
        case 0:
          this.toastrService.message("Sunucuya erişilemiyor", "Bağlantı Hatası", { messageType: ToastrMessageType.Warning, position: ToastrPosition.TopRight });
          break;
        default:
          this.toastrService.message("Beklenmeyen Bir Hata Meydana Geldi", "Hata",{messageType:ToastrMessageType.Warning, position:ToastrPosition.TopRight})
          break;
      }
      this.spinner.hide(SpinnerType.BallAtom)
      return of(error);
    }));
  }
}
