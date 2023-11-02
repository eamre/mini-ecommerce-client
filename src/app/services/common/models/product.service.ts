import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { CreateProduct } from 'src/app/contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { ListProduct } from 'src/app/contracts/list_product';
import { Observable, firstValueFrom } from 'rxjs';
import { ListProductImage } from 'src/app/contracts/list_product_image';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClientService: HttpClientService) {}

  create(product: CreateProduct, successCallBack?: ()=>void, errorCallBack?:(errorMessage:string)=>void) {
    this.httpClientService
      .post({ controller: 'products' }, product)
      .subscribe({
        next: (result) => {
          successCallBack();
        },
        error: (errorResponse:HttpErrorResponse)=>{
          const _error:Array<{key:string, value:Array<string>}> = errorResponse.error;
          let message = _error.map(v => v.value.join("<br>")).join("<br>");
          errorCallBack(message);
        }
      });
  }

  async read(page:number=0, size:number=5, successCallBack?:()=>void, errorCallBack?:(errorMessage:string)=>void):Promise<{totalProducts:number,products:ListProduct[]}>{
    const promiseData: Promise<{totalProducts:number,products:ListProduct[]}> = this.httpClientService.get<{totalProducts:number,products:ListProduct[]}>({
      controller:"products",
      queryString:`Pagination.page=${page}&Pagination.size=${size}`
    }).toPromise();

    promiseData.then(successCallBack)
    .catch((errorResponse: HttpErrorResponse)=>errorCallBack(errorResponse.message))

    return await promiseData;
  }

  async delete(id:string){
    const deleteObservable: Observable<any> = this.httpClientService.delete<any>({
      controller:"products"
    },id);

    await firstValueFrom(deleteObservable)
  }

  async readImages(id:string, successCallBack?:()=> void): Promise<ListProductImage[]>{
    const getImages : Observable<ListProductImage[]> = this.httpClientService.get<ListProductImage[]>({
      action:"GetProductImages",
      controller:"Products",
    },id);
    const images: ListProductImage[] = await firstValueFrom(getImages)
    successCallBack();
    return images
  }

  async deleteImage(productId:string, imageId: string, successCallBack?:()=>void){
    const deleteImg = this.httpClientService.delete({
      controller:"products",
      action:"DeleteProductImage",
      queryString:`imageId=${imageId}`
    },productId)

    await firstValueFrom(deleteImg)
    successCallBack();
  }

}
