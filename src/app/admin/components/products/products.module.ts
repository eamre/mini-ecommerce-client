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
import { FileUploadModule } from 'src/app/services/common/file-upload/file-upload.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { ProductsComponent } from './products.component';
@NgModule({
  declarations: [ProductsComponent, CreateComponent, ListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ProductsComponent }]),
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    DialogModule,
    FileUploadModule,
    DeleteDirectiveModule,
  ],
})
export class ProductsModule {}
