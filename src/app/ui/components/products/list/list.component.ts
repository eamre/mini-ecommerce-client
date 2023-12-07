import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseUrl } from 'src/app/contracts/base_url';
import { ListProduct } from 'src/app/contracts/list_product';
import { FileService } from 'src/app/services/common/models/file.service';
import { ProductService } from 'src/app/services/common/models/product.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService) { }

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
        () => { },
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
