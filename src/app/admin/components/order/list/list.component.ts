import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Roles } from 'src/app/constants/roles';
import { ListProduct } from 'src/app/contracts/list_product';
import { ListOrder } from 'src/app/contracts/order/list-order';
import { OrderDetailDialogComponent, OrderDetailDialogState } from 'src/app/dialogs/order-detail-dialog/order-detail-dialog.component';
import { SelectProductImageDialogComponent } from 'src/app/dialogs/select-product-image-dialog/select-product-image-dialog.component';
import { AlertifyService, MessagePosition, MessageType } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { OrderService } from 'src/app/services/common/models/order.service';
import { ProductService } from 'src/app/services/common/models/product.service';
import { RoleService } from 'src/app/services/common/models/role.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(
    spinner:NgxSpinnerService,
    private orderService:OrderService,
    private alertifyService:AlertifyService,
    private dialogService: DialogService,
    private roleService: RoleService
    ) {
    super(spinner);
  }
  async ngOnInit() {
    await this.getOrders();
  }

  displayedColumns: string[] = ['orderCode', 'userName', 'totalPrice', 'createDate','viewDetails','delete','completed'];
  dataSource : MatTableDataSource<ListOrder> = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  roles=Roles

  async getOrders(){
    this.showSpinner(SpinnerType.BallAtom);
    let allOrders:{totalOrdersCount:number,orders:ListOrder[]} =
    await this.orderService.getAllOrders(this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize:5, ()=>this.hideSpinner(SpinnerType.BallAtom),
    (errorMessage:any) => this.alertifyService.message(errorMessage.message,
      {messageType:MessageType.Error,position:MessagePosition.TopRight}));

    this.dataSource = new MatTableDataSource<ListOrder>(allOrders.orders);
    this.paginator.length = allOrders.totalOrdersCount;
    // this.dataSource.paginator = this.paginator;
    this.paginator.color='primary'
    if(this.paginator.pageIndex > 0 && this.dataSource.data.length === 0){
      this.paginator.previousPage(); // Önceki sayfaya dön
      await this.getOrders();
    }
  }

  async pageChanged(){
    await this.getOrders();
  }

  roleCheck(role:string):boolean{
    return this.roleService.hasRole(role);
  }

  showDetail(id:string){
    this.dialogService.openDialog({
      compontentType: OrderDetailDialogComponent,
      data: id,
      options:{
        width: "750px"
      }
    })
    debugger
  }


}
