import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { ListOrder } from 'src/app/contracts/order/list-order';
import { ListUser } from 'src/app/contracts/users/list_user';
import { AuthorizeUserDialogComponent } from 'src/app/dialogs/authorize-user-dialog/authorize-user-dialog.component';
import { OrderDetailDialogComponent } from 'src/app/dialogs/order-detail-dialog/order-detail-dialog.component';
import { AlertifyService, MessagePosition, MessageType } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { OrderService } from 'src/app/services/common/models/order.service';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(
    spinner:NgxSpinnerService,
    private userService:UserService,
    private alertifyService:AlertifyService,
    private dialogService: DialogService
    ) {
    super(spinner);
  }
  async ngOnInit() {
    await this.getUsers();
  }

  displayedColumns: string[] = ['userName', 'nameSurname', 'email', 'twoFactorEnabled', 'role', 'delete'];
  dataSource : MatTableDataSource<ListUser> = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getUsers(){
    this.showSpinner(SpinnerType.BallAtom);
    let allUsers:{totalUsersCount:number,users:ListUser[]} =
    await this.userService.getAllUsers(this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize:5, ()=>this.hideSpinner(SpinnerType.BallAtom),
    (errorMessage) => this.alertifyService.message(errorMessage,
      {messageType:MessageType.Error,position:MessagePosition.TopRight}));

    this.dataSource = new MatTableDataSource<ListUser>(allUsers.users);
    this.paginator.length = allUsers.totalUsersCount;
    this.paginator.color='primary'
    if(this.paginator.pageIndex > 0 && this.dataSource.data.length === 0){
      this.paginator.previousPage(); // Önceki sayfaya dön
      await this.getUsers();
    }
  }

  async pageChanged(){
    await this.getUsers();
  }

  assignRole(id:string, userName:string){
    this.dialogService.openDialog({
      compontentType: AuthorizeUserDialogComponent,
      data:{id,userName},
      options:{
        width:"50em"
      },
      afterClosedDialog: ()=>{
        this.alertifyService.message("Roller Başarıyla Atandı",{
          messageType:MessageType.Success,
          position: MessagePosition.TopRight
        })
      }
    })
  }


}
