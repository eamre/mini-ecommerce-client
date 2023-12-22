import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'src/app/dialogs/dialog.module';
import { DeleteDirectiveModule } from 'src/app/directives/admin/delete-directive.module';
import { ListComponent } from './list/list.component';
import { OrderComponent } from './order.component';

@NgModule({
  declarations: [OrderComponent, ListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: OrderComponent }]),
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    DialogModule,
    DeleteDirectiveModule,
  ],
})
export class OrderModule {}
