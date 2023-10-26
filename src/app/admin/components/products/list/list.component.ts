import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { ListProduct } from 'src/app/contracts/list_product';
import { SelectProductImageDialogComponent } from 'src/app/dialogs/select-product-image-dialog/select-product-image-dialog.component';
import { AlertifyService, MessagePosition, MessageType } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { ProductService } from 'src/app/services/common/models/product.service';

declare var $:any
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {
  constructor(
    spinner:NgxSpinnerService,
    private productService:ProductService,
    private alertifyService:AlertifyService,
    private dialogService: DialogService) {
    super(spinner);
  }

  displayedColumns: string[] = ['name', 'stock', 'price', 'createDate','updatedDate','photos','edit','delete'];
  dataSource : MatTableDataSource<ListProduct> = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getProducts(){
    this.showSpinner(SpinnerType.BallAtom);
    let allProducts:{totalProducts:number,products:ListProduct[]} =
    await this.productService.read(this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize:5, ()=>this.hideSpinner(SpinnerType.BallAtom),
    (errorMessage) => this.alertifyService.message(errorMessage,{messageType:MessageType.Error,position:MessagePosition.TopRight}));

    this.dataSource = new MatTableDataSource<ListProduct>(allProducts.products);
    this.paginator.length = allProducts.totalProducts;
    // this.dataSource.paginator = this.paginator;
    this.paginator.color='primary'
    if(this.paginator.pageIndex > 0 && this.dataSource.data.length === 0){
      this.paginator.previousPage(); // Önceki sayfaya dön
      await this.getProducts();
    }
  }

  async pageChanged(){
    await this.getProducts();
  }

  addProductImages(id: string){
    this.dialogService.openDialog({
      compontentType:SelectProductImageDialogComponent,
      data: id,
      options:{
        width:"1400px"
      }
    })
  }

  edit(id:string){
    alert(id);
  }

  async ngOnInit() {
    await this.getProducts();
  }
}
