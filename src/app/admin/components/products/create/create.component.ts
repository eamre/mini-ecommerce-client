import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { CreateProduct } from 'src/app/contracts/create_product';
import {
  AlertifyService,
  MessagePosition,
  MessageType,
} from 'src/app/services/admin/alertify.service';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent extends BaseComponent implements OnInit {
  constructor(
    private productService: ProductService,
    spinner: NgxSpinnerService,
    private alertify: AlertifyService
  ) {
    super(spinner);
  }

  ngOnInit(): void {}

  @Output() createdProduct: EventEmitter<CreateProduct> = new EventEmitter();
  // fileUploadOptions: Partial<FileUploadOptions>={
  //   action:"upload",
  //   controller:"products",
  //   explanation:"resimleri seçin",
  //   isAdminPage:true,
  //   accept:".png, .jpg, .jpeg"
  // }

  create(
    name: HTMLInputElement,
    stock: HTMLInputElement,
    price: HTMLInputElement
  ) {
    this.showSpinner(SpinnerType.BallAtom);
    const create_product: CreateProduct = new CreateProduct();
    create_product.name = name.value;
    create_product.stock = parseInt(stock.value);
    create_product.price = parseFloat(price.value);

    this.productService.create(create_product, () => {
      this.hideSpinner(SpinnerType.BallAtom),
      this.alertify.message('ürün başarıyla eklendi', {
        messageType: MessageType.Success,
        dismissOthers: true,
        position: MessagePosition.TopRight,
      });
      this.createdProduct.emit(create_product);
    },(errorMessage)=>{
      this.alertify.message(errorMessage,{messageType:MessageType.Error,position:MessagePosition.TopRight});
    });
  }
}
