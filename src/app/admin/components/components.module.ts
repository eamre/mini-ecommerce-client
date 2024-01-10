import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order.component';
import { ProductsModule } from './products/products.module';
import { OrderModule } from './order/order.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CustomerModule } from './customer/customer.module';
import { AuthorizeMenuComponent } from './authorize-menu/authorize-menu.component';
import { AuthorizeMenuModule } from './authorize-menu/authorize-menu.module';
import { RoleModule } from './role/role.module';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ProductsModule,
    OrderModule,
    DashboardModule,
    CustomerModule,
    AuthorizeMenuModule,
    RoleModule
  ]
})
export class ComponentsModule { }
