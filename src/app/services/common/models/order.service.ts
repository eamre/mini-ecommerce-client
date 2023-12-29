import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { CreateOrder } from 'src/app/contracts/order/create-order';
import { Observable, firstValueFrom } from 'rxjs';
import { ListOrder } from 'src/app/contracts/order/list-order';
import { SingleOrder } from 'src/app/contracts/order/single-order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClientService:HttpClientService) { }

  async create(order:CreateOrder){
    const observable:Observable<any> = this.httpClientService.post({
      controller:"orders"
    },order)
    await firstValueFrom(observable)
  }

  async getAllOrders(page:number=0, size:number=5, successCallBack?:()=>void,
  errorCallBack?:(errorMessage:string)=>void):Promise<{totalOrdersCount:number,orders:ListOrder[]}>{
    const observable:Observable<{totalOrdersCount:number,orders:ListOrder[]}> = this.httpClientService.get({
      controller:"orders",
      queryString:`Pagination.page=${page}&Pagination.size=${size}`
    })
    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
    .catch(error => errorCallBack(error))
    return await promiseData
  }

  async getOrderById(id:string, successCallBack?:()=>void, errorCallBack?:(errorMessage:string)=>void){
    const observable:Observable<SingleOrder> = this.httpClientService.get<SingleOrder>({
      controller:"orders",
    },id)
    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
    .catch(error => errorCallBack(error))
    return await promiseData
  }

  async completeOrder(id:string){
    const observable:Observable<any>=this.httpClientService.get({
      controller:"orders",
      action: "CompleteOrder"
    },id);

    await firstValueFrom(observable);
  }
}
