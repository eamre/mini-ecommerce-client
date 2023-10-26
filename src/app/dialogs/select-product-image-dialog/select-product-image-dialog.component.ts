import { Component, Inject, OnInit, Output } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';
import { ListProductImage } from 'src/app/contracts/list_product_image';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { MatCard } from '@angular/material/card';
import { DialogService } from 'src/app/services/common/dialog.service';
import { DeleteDialogComponent, DeleteState } from '../delete-dialog/delete-dialog.component';
import { async } from 'rxjs';

declare var $: any

@Component({
  selector: 'app-select-product-image-dialog',
  templateUrl: './select-product-image-dialog.component.html',
  styleUrls: ['./select-product-image-dialog.component.scss']
})
export class SelectProductImageDialogComponent extends BaseDialog<SelectProductImageDialogComponent> implements OnInit {

  constructor(dialogRef : MatDialogRef<SelectProductImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectProductImageState | string,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService) {
    super(dialogRef);
  }

  @Output() options: Partial<FileUploadOptions>= {
    accept:".png, .jpg, .jpeg, .gif",
    action:"upload",
    controller: "products",
    explanation:"ürün resmini seçin veya buraya sürükleyin.",
    isAdminPage:true,
    queryString :`id=${this.data}`
  }
  // x = Array(10).fill(null);
  images: ListProductImage[];

  async ngOnInit(): Promise<void> {
    this.spinner.show(SpinnerType.BallAtom)
    this.images = await this.productService.readImages(this.data as string, ()=>{this.spinner.hide(SpinnerType.BallAtom)})
  }

  async deleteImage(imageId:string){
    this.dialogService.openDialog({
      compontentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosedDelete: async () =>{
        this.spinner.show(SpinnerType.BallAtom)
        await this.productService.deleteImage(this.data as string, imageId, ()=>{
          this.spinner.hide(SpinnerType.BallAtom);
          $("#" + imageId).fadeOut(1000, () => { $(this).remove(); });
       })
      }
    })
  }
}

export enum SelectProductImageState{
  Close
}
