import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from 'src/app/entities/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }

  frm: FormGroup;
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
      const password = group.get('password');
      const passwordAgain = group.get('passwordAgain');
      if (password && passwordAgain && password.value !== passwordAgain.value)
        this.passwordsMatch = false
      else
        this.passwordsMatch = true
      return null;
      }
    })
  }

  get component(){
    return this.frm.controls;
  }

  onSubmit(data:User){
    this.submitted = true;
  }

}
