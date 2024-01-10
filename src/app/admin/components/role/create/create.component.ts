import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AlertifyService, MessagePosition, MessageType } from 'src/app/services/admin/alertify.service';
import { RoleService } from 'src/app/services/common/models/role.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends BaseComponent implements OnInit {

  constructor(
    private roleService: RoleService,
    spinner: NgxSpinnerService,
    private alertify: AlertifyService
  ) {
    super(spinner);
  }

  ngOnInit(): void {}

  @Output() createRole: EventEmitter<string> = new EventEmitter();

  create(
    name: HTMLInputElement,
  ) {
    this.showSpinner(SpinnerType.BallAtom);
    this.roleService.create(name.value, () => {
      this.hideSpinner(SpinnerType.BallAtom),
      this.alertify.message('Rol başarıyla eklendi', {
        messageType: MessageType.Success,
        dismissOthers: true,
        position: MessagePosition.TopRight,
      });
      this.createRole.emit(name.value);
    },(errorMessage)=>{
      this.alertify.message(errorMessage,{messageType:MessageType.Error,position:MessagePosition.TopRight});
    });
  }
}
