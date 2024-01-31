import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { ListBasketItem } from 'src/app/contracts/basket/list-basket-item';
import { UpdateBasketItem } from 'src/app/contracts/basket/update-basket-item';
import { CreateOrder } from 'src/app/contracts/order/create-order';
import { BasketItemDeleteState, BasketItemRemoveDialogComponent } from 'src/app/dialogs/basket-item-remove-dialog/basket-item-remove-dialog.component';
import { ShoppingCompleteDialogComponent, ShoppingCompleteState } from 'src/app/dialogs/shopping-complete-dialog/shopping-complete-dialog.component';
import { DialogService } from 'src/app/services/common/dialog.service';
import { BasketService } from 'src/app/services/common/models/basket.service';
import { OrderService } from 'src/app/services/common/models/order.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';
import { log } from 'util';

declare var $: any
@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrls: ['./baskets.component.scss']
})
export class BasketsComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService,
    private basketService: BasketService,
    private orderService: OrderService,
    private toastr:CustomToastrService,
    private router: Router,
    private dialogService:DialogService ) {
    super(spinner);
  }

  basketItems: ListBasketItem[]

  async ngOnInit(): Promise<void> {
    this.showSpinner(SpinnerType.BallAtom)
    this.basketItems = await this.basketService.get();

    this.hideSpinner(SpinnerType.BallAtom)
  }

  async changeQuantity(object:any){
    this.showSpinner(SpinnerType.BallAtom)
    let newQuantity:number = object.target.value;
    let basketItemId:string = object.target.id;

    let basketItem: UpdateBasketItem = new UpdateBasketItem()
    basketItem.basketItemId = basketItemId;
    basketItem.quantity = newQuantity;

    await this.basketService.updateQuantity(basketItem);
    this.hideSpinner(SpinnerType.BallAtom)
  }

  async saveSelected(isSelected:boolean, basketItemId:string){
    let basketItem: UpdateBasketItem = new UpdateBasketItem()
    basketItem.basketItemId = basketItemId
    basketItem.isSelected = isSelected;

    await this.basketService.updateBasketItemSelected(basketItem);
  }

  async removeBasketItem(basketItemId:string){
    this.dialogService.openDialog({
      compontentType:BasketItemRemoveDialogComponent,
      data:BasketItemDeleteState.Yes,
      afterClosedDialog: async () => {
        this.showSpinner(SpinnerType.BallAtom)
        await this.basketService.remove(basketItemId);
        $("."+basketItemId).fadeOut(200,()=> this.hideSpinner(SpinnerType.BallAtom))
      },
    });
  }

  async shoppingComplete(){
    this.dialogService.openDialog({
      compontentType:ShoppingCompleteDialogComponent,
      data:ShoppingCompleteState.Yes,
      afterClosedDialog:async ()=>{
        this.showSpinner(SpinnerType.BallAtom)
        const order: CreateOrder = new CreateOrder();
        order.address ="Bursa"
        order.description="Dene"
        await this.orderService.create(order)
        this.hideSpinner(SpinnerType.BallAtom)
        this.toastr.message("sipariş oluşturuldu","",{messageType:ToastrMessageType.Success, position: ToastrPosition.BottomRight})
        this.router.navigate(["/"])
        $("#basketModal").modal("hide")
      }
    })
  }
}
