import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { ListRole } from 'src/app/contracts/role/list_role';
import { AuthorizationEndpoitService } from 'src/app/services/common/models/authorization-endpoit.service';
import { RoleService } from 'src/app/services/common/models/role.service';
import { AuthorizeMenuDialogComponent } from '../authorize-menu-dialog/authorize-menu-dialog.component';
import { BaseDialog } from '../base/base-dialog';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-authorize-user-dialog',
  templateUrl: './authorize-user-dialog.component.html',
  styleUrls: ['./authorize-user-dialog.component.scss']
})
export class AuthorizeUserDialogComponent extends BaseDialog<AuthorizeUserDialogComponent> implements OnInit {

  constructor(dialogRef: MatDialogRef<AuthorizeUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService,
    private userService:UserService,
    private spinner: NgxSpinnerService,
    private cdref: ChangeDetectorRef) {
    super(dialogRef);
  }

  ngAfterContentChecked(){
    this.cdref.detectChanges();
  }

  datas: {roles: Map<string, string>, totalRoleCount: number};
  rol:ListRole[] = []
  assignedRoles:string[] = []

  async ngOnInit(): Promise<void> {
    this.spinner.show(SpinnerType.BallScaleMultiple)
    this.datas = await this.roleService.getRoles(-1, -1)
    for(let roleId in this.datas.roles){
      let roleName = this.datas.roles[roleId]
      this.rol.push({id: roleId, name: roleName})
    }

    this.assignedRoles = await this.userService.getRolesOfUser(this.data, ()=>{this.spinner.hide(SpinnerType.BallScaleMultiple)})
  }

  assignRoles(rolesComponent: MatSelectionList){
    const roles: string[] = rolesComponent.selectedOptions.selected.map(o => o._text.nativeElement.innerText);
    this.spinner.show(SpinnerType.BallAtom)
    this.userService.assignRoleToUser(this.data, roles ,()=>{this.spinner.hide(SpinnerType.BallAtom)},error=>{})
  }

  isExistRole(name: string): boolean {
    return this.assignedRoles.some(r => r === name);
  }

}
