import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/base/base.component';
import { CreateUserResponse } from 'src/app/contracts/users/create_user';
import { User } from 'src/app/entities/user';
import { UserService } from 'src/app/services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit {

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService:UserService,
    private toastService: CustomToastrService,
    spinner: NgxSpinnerService
    ) {
    super(spinner);
  }

  frm: UntypedFormGroup;
  submitted: boolean = false;
  passwordsMatch: boolean = false;

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      name: ["",[Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      username:["",[Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      email:["",[Validators.required, Validators.maxLength(250), Validators.email]],
      password:["",[Validators.required]],
      passwordAgain:["",[Validators.required]],
    },{validators: (group:AbstractControl):ValidationErrors | null => {
      let passw = group.get("password").value;
        let passw2 = group.get("passwordAgain").value;
        return passw === passw2 ? null : { notSame: true };
      }
    })
  }

  get component(){
    return this.frm.controls;
  }

  async onSubmit(user:User){
    this.submitted = true;
    if(this.frm.invalid)
      return;

    let result : CreateUserResponse = await this.userService.create(user);

    if(result.success) {
      this.toastService.message(result.message, "Kullanıcı kaydı başarılı",{
        messageType: ToastrMessageType.Success,
        position:ToastrPosition.TopRight
      })
    }
    else{
      this.toastService.message(result.message, "Hata",{
        messageType: ToastrMessageType.Error,
        position:ToastrPosition.TopRight
      })
    }
  }
}
