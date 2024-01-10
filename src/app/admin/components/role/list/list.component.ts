import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { ListRole } from 'src/app/contracts/role/list_role';
import { AlertifyService, MessagePosition, MessageType } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { RoleService } from 'src/app/services/common/models/role.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(
    spinner:NgxSpinnerService,
    private roleService: RoleService,
    private alertifyService:AlertifyService,
    private dialogService: DialogService) {
    super(spinner);
  }

  displayedColumns: string[] = ['name','edit','delete'];
  dataSource : MatTableDataSource<ListRole> = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getRoles(){
    this.showSpinner(SpinnerType.BallAtom);
    let allRoles:{totalRoleCount:number, roles:Map<string, string>} =
    await this.roleService.getRoles(this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize:5, ()=>this.hideSpinner(SpinnerType.BallAtom),
    (errorMessage) => this.alertifyService.message(errorMessage,{messageType:MessageType.Error,position:MessagePosition.TopRight}));

    const _rolesData: ListRole[] = [];
    for (const roleId in allRoles.roles) {
      const roleName = allRoles.roles[roleId];
      _rolesData.push({ id: roleId, name: roleName });
    }

    this.dataSource = new MatTableDataSource<ListRole>(_rolesData);
    this.paginator.length = allRoles.totalRoleCount;

    this.paginator.color='primary'
    if(this.paginator.pageIndex > 0 && this.dataSource.data.length === 0){
      this.paginator.previousPage();
      await this.getRoles();
    }
  }

  async pageChanged(){
    await this.getRoles();
  }

  edit(id:string){
    alert(id);
  }

  async ngOnInit() {
    await this.getRoles();
  }

}
