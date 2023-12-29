import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from 'src/app/services/common/models/order.service';
import { SingleOrder } from 'src/app/contracts/order/single-order';
import { DialogService } from 'src/app/services/common/dialog.service';
import { CompleteOrderDialogComponent, CompleteOrderDialogState } from '../complete-order-dialog/complete-order-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html',
  styleUrls: ['./order-detail-dialog.component.scss']
})
export class OrderDetailDialogComponent extends BaseDialog<OrderDetailDialogComponent> implements OnInit {

  constructor(dialogRef:MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailDialogState | string,
    private orderService:OrderService,
    private dialogService:DialogService,
    private spinner: NgxSpinnerService,
    private toastr:CustomToastrService) {
    super(dialogRef);
  }

  singleOrder:SingleOrder;
  totalPrice:number;
  displayedColumns: string[] = ['name', 'price', 'quantity', 'totalPrice'];
  dataSource = [];
  clickedRows = new Set<any>();

  async ngOnInit(): Promise<void> {
    this.singleOrder = await this.orderService.getOrderById(this.data as string,()=>{},(errorMessage) => {})
    debugger
    this.dataSource = this.singleOrder.basketItems;
    this.totalPrice = this.singleOrder.basketItems
      .reduce((price, basketItem) => price + (basketItem.price * basketItem.quantity), 0);
  }

  completeOrder(){
    this.dialogService.openDialog({
      compontentType:CompleteOrderDialogComponent,
      data: CompleteOrderDialogState.Yes,
      afterClosedDelete: async ()=>{
        this.spinner.show(SpinnerType.BallAtom)
        await this.orderService.completeOrder(this.data as string)
        this.spinner.hide(SpinnerType.BallAtom)
        this.toastr.message("sipariş onaylandı","sipariş sizi bekliyor",
        {
          messageType:ToastrMessageType.Success,
          position:ToastrPosition.TopRight
        })
      }
    })
  }

}
export enum OrderDetailDialogState{
  OrderComplete,
  Cancel
}
