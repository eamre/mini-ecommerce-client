import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { BaseUrl } from 'src/app/contracts/base_url';
import { CreateBasketItem } from 'src/app/contracts/basket/create-basket-item';
import { ListProduct } from 'src/app/contracts/list_product';
import { BasketService } from 'src/app/services/common/models/basket.service';
import { FileService } from 'src/app/services/common/models/file.service';
import { ProductService } from 'src/app/services/common/models/product.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private basketService: BasketService,
    spinner:NgxSpinnerService,
    private toastr: CustomToastrService) {
    super(spinner);
  }

  products: ListProduct[];
  totalProductsCount: number;
  totalPageCount: number;
  pageSize: number = 8
  pageList: number[] = [];//sayfa numaralarını tutacak
  currentPageNo: number;
  baseUrl:BaseUrl;

  async ngOnInit() {
    this.baseUrl = await this.fileService.getBaseStorageUrl();
    this.activatedRoute.params.subscribe(async params =>{
      this.currentPageNo = parseInt(params["pageNo"] ?? 1);
      const data:{totalProducts:number,products:ListProduct[]} = await this.productService.read(this.currentPageNo - 1, this.pageSize,
        () => {},
        (errorMessage) => { });

      this.products = data.products;
      this.products = this.products.map<ListProduct>(p => {
        const listProduct: ListProduct = {
          id: p.id,
          createdDate: p.createdDate,
          imagePath: p.productImages.length ? p.productImages?.find(p => p.showcase)?.path : "",
          name: p.name,
          price: p.price,
          stock: p.stock,
          updatedDate: p.updatedDate,
          productImages: p.productImages
        };
        return listProduct;
      });

      this.totalProductsCount = data.totalProducts;
      this.totalPageCount = Math.ceil(this.totalProductsCount / this.pageSize);
      this.pageList = [];

      if(data.products.length<1){
        console.log("a");
        return
      }

      if(this.currentPageNo - 3 <= 0){
        for(let i = 1; i<=this.totalPageCount; i++){
          this.pageList.push(i)
        }
      }
      else if(this.currentPageNo + 3 >= this.totalPageCount){
        for(let i = this.totalPageCount - 6; i<= this.totalPageCount; i++){
          this.pageList.push(i)
        }
      }
      else{
        for(let i = this.currentPageNo - 3; i<= this.currentPageNo+3; i++){
          this.pageList.push(i)
        }
      }
    });

  }

  async addToBasket(product:ListProduct){
    this.showSpinner(SpinnerType.BallAtom);

    let _basketItem:CreateBasketItem = new CreateBasketItem()
    _basketItem.productId = product.id;
    _basketItem.quantity = 1;
    await this.basketService.add(_basketItem);

    this.hideSpinner(SpinnerType.BallAtom);
    this.toastr.message("","Ürün Sepete Eklendi",{messageType:ToastrMessageType.Success,position:ToastrPosition.TopRight})
  }

}
// this.products.forEach((product, i)=>{
//   let p: any={
//     name:product.name,
//     id:product.id,
//     price:product.price,
//     stock:product.stock,
//     updatedDate:product.updatedDate,
//     createdDate:product.createdDate,
//     imagePath:product.productImages.length ? product.productImages?.find(p=>p.showcase).path : ""
//   }
// });
