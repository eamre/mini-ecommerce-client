import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Product } from 'src/app/contracts/product';
import { HttpClientService } from 'src/app/services/common/http-client.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent extends BaseComponent implements OnInit {
  constructor(
    spinner: NgxSpinnerService,
    private httpClientService: HttpClientService
  ) {
    super(spinner);
  }

  ngOnInit(): void {
    this.showSpinner(SpinnerType.BallAtom);

    this.httpClientService
      .get<Product[]>({
        controller: 'products',
      })
      .subscribe((data) => console.log(data));

    // this.httpClientService
    //   .get({
    //     fullEndPoint: 'https://jsonplaceholder.typicode.com/users',
    //   })
    //   .subscribe((data:any) => {
    //     for(let user of data){
    //       console.log(user.name);
    //     }
    //   });

    // this.httpClientService.post(
    //   {
    //     controller: 'products',
    //   },
    //   {
    //     name: 'product2',
    //     stock: 200,
    //     price: 25,
    //   }
    // ).subscribe();

    // this.httpClientService
    //   .put(
    //     {
    //       controller: 'products',
    //     },
    //     {
    //       id: '16497eb3-a452-4222-a3ce-66fa115d308f',
    //       name: 'renkli kagit',
    //       stock: 20,
    //       price: 28,
    //     }
    //   )
    //   .subscribe();

    // this.httpClientService
    //   .delete(
    //     {
    //       controller: 'products',
    //     },
    //     '16497eb3-a452-4222-a3ce-66fa115d308f'
    //   )
    //   .subscribe();
  }
}
