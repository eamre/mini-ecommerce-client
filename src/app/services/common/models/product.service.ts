import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { CreateProduct } from 'src/app/contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { ListProduct } from 'src/app/contracts/list_product';

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
      queryString:`page=${page}&size=${size}`
    }).toPromise();

    promiseData.then(successCallBack)
    .catch((errorResponse: HttpErrorResponse)=>errorCallBack(errorResponse.message))

    return await promiseData;
  }
}
