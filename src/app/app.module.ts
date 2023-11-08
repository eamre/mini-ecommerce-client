import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { UiModule } from './ui/ui.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    AppRoutingModule,
    AdminModule,
    UiModule,
    HttpClientModule,
    JwtModule.forRoot({
      config:{
        tokenGetter:()=> localStorage.getItem("accessToken"),
        allowedDomains:["localhost:7043"]
      }
    })
  ],
  providers: [
    {provide:"baseUrl",useValue:"https://localhost:7043/api",multi : true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
