import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { DialogPosition, MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialog(dialogParameters: Partial<DialogParameters>): void {
    const dialogRef = this.dialog.open(dialogParameters.compontentType, {
      width: dialogParameters.options?.width,
      height: dialogParameters.options?.height,
      position: dialogParameters.options?.position,
      data: dialogParameters.data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == dialogParameters.data) {
        debugger
        dialogParameters.afterClosedDelete();
      }
    });
  }
}
export class DialogParameters{
  compontentType: ComponentType<any>;
  data: any;
  afterClosedDelete:()=>void;
  options?: Partial<DialogOptions>;
}
export class DialogOptions{
  width?: string;
  height?: string;
  position?: DialogPosition;
}
