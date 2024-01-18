import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleService } from 'src/app/services/common/models/role.service';
import { ListRole } from 'src/app/contracts/role/list_role';
import { MatSelectionList } from '@angular/material/list';
import { AuthorizationEndpoitService } from 'src/app/services/common/models/authorization-endpoit.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-authorize-menu-dialog',
  templateUrl: './authorize-menu-dialog.component.html',
  styleUrls: ['./authorize-menu-dialog.component.scss']
})
export class AuthorizeMenuDialogComponent extends BaseDialog<AuthorizeMenuDialogComponent> implements OnInit, AfterContentChecked {

  constructor(dialogRef: MatDialogRef<AuthorizeMenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService,
    private authorizationEndpoitService: AuthorizationEndpoitService,
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
    this.datas = await this.roleService.getRoles(-1, -1)
    for(let roleId in this.datas.roles){
      let roleName = this.datas.roles[roleId]
      this.rol.push({id: roleId, name: roleName})
    }

    this.assignedRoles = await this.authorizationEndpoitService.getRolesOfEndpoint(this.data.code, this.data.menuName)
  }

  assignRoles(rolesComponent: MatSelectionList){
    const roles: string[] = rolesComponent.selectedOptions.selected.map(o => o._text.nativeElement.innerText);
    this.spinner.show(SpinnerType.BallAtom)
    this.authorizationEndpoitService.assignRoleEndpoint(roles, this.data.code, this.data.menuName,()=>{this.spinner.hide(SpinnerType.BallAtom)},error=>{})
  }

  isExistRole(name: string): boolean {
    return this.assignedRoles.some(r => r === name);
  }

}

export enum AuthorizeMenuState{
  Yes,
  No
}
