import { Directive, ElementRef, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { ProductService } from 'src/app/services/common/models/product.service';
import { EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent, DeleteState } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
declare var $:any

@Directive({
  selector: '[appDelete]',
})
export class DeleteDirective {
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private productService : ProductService,
    public dialog: MatDialog
  ) {
    const img = renderer.createElement("img");
    img.setAttribute("src","/assets/img/delete.png");
    img.setAttribute("style", "cursor: pointer; width: 2.2em;");
    renderer.appendChild(element.nativeElement, img)
  }

  @Input() id: string;
  @Output() cb: EventEmitter<any> = new EventEmitter();

  @HostListener("click")
  async onClick(){
    this.openDialog(async ()=>{
      const td: HTMLTableCellElement = this.element.nativeElement;
      await this.productService.delete(this.id)
      $(td.parentElement).fadeOut(800,()=>{
        this.cb.emit();
      });
    });
  }

  openDialog(afterClosedDelete:()=>{}): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: DeleteState.Yes
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == DeleteState.Yes){
        afterClosedDelete();
      }
    });
  }
}
