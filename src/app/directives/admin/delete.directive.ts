import { Directive,ElementRef,HostListener, Input, Output, Renderer2,} from '@angular/core';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {DeleteDialogComponent, DeleteState} from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { AlertifyService, MessagePosition, MessageType } from 'src/app/services/admin/alertify.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { DialogService } from 'src/app/services/common/dialog.service';
declare var $: any;

@Directive({
  selector: '[appDelete]',
})
export class DeleteDirective {
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private httpClientService: HttpClientService,
    public dialog: MatDialog,
    private alertify: AlertifyService,
    private dialogService:DialogService
  ) {
    const img = renderer.createElement('img');
    img.setAttribute('src', '/assets/img/delete.png');
    img.setAttribute('style', 'cursor: pointer; width: 2.2em;');
    renderer.appendChild(element.nativeElement, img);
  }

  @Input() id: string;
  @Input() controller: string;
  @Output() cb: EventEmitter<any> = new EventEmitter();

  @HostListener('click')
  async onClick() {
    this.dialogService.openDialog({
      compontentType:DeleteDialogComponent,
      data:DeleteState.Yes,
      afterClosedDelete: async () => {
        const td: HTMLTableCellElement = this.element.nativeElement;
        this.httpClientService
          .delete(
            {
              controller: this.controller,
            },
            this.id
          ).pipe(
            catchError((errResponse:HttpErrorResponse)=>{
              this.alertify.message('ürün silinirken bir hata oldu.', {
                messageType: MessageType.Error,
                position: MessagePosition.TopRight,
              });
              return of(null);
            })
          )
          .subscribe((data) => {
            $(td.parentElement).fadeOut(800, () => {
              this.cb.emit();
              this.alertify.message("ürün başariyla silinmiştir.",
              {messageType: MessageType.Success, position:MessagePosition.TopRight})
            });
          });
      }
    });
  }

  // openDialog(afterClosedDelete: () => {}): void {
  //   const dialogRef = this.dialog.open(DeleteDialogComponent, {
  //     data: DeleteState.Yes,
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result == DeleteState.Yes) {
  //       afterClosedDelete();
  //     }
  //   });
  // }
}
function of(arg0: null): any {
  throw new Error('Function not implemented.');
}

