import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxFileDropEntry } from 'ngx-file-drop';
import {
  FileUploadDialogComponent,
  FileUploadDialogState,
} from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import {
  AlertifyService,
  MessagePosition,
  MessageType,
} from '../../admin/alertify.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../../ui/custom-toastr.service';
import { HttpClientService } from '../http-client.service';
import { DialogService } from '../dialog.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  constructor(
    private httpClientService: HttpClientService,
    private alertify: AlertifyService,
    private toastr: CustomToastrService,
    private dialog: MatDialog,
    private dialogService:DialogService,
    private spinner:NgxSpinnerService
  ) {}

  public files: NgxFileDropEntry[];
  @Input() options: Partial<FileUploadOptions>;

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData: FormData = new FormData();
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append(_file.name, _file, file.relativePath);
      });
    }
    this.dialogService.openDialog({
      compontentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes,
      afterClosedDialog: ()=>{
        this.spinner.show(SpinnerType.BallAtom)
        this.httpClientService
          .post(
            {
              controller: this.options.controller,
              action: this.options.action,
              queryString: this.options.queryString,
              headers: new HttpHeaders({ "responseType": 'blob' })
            },
            fileData
          )
          .subscribe(
            (data) => {
              const message: string = 'dosyalar başarıyla yüklendi';
              this.spinner.hide(SpinnerType.BallAtom)
              if (this.options.isAdminPage) {
                this.alertify.message(message, {
                  messageType: MessageType.Success,
                  position: MessagePosition.TopRight,
                });
              } else {
                this.toastr.message(message, 'Başarılı', {
                  messageType: ToastrMessageType.Success,
                  position: ToastrPosition.TopRight,
                });
              }
            },
            (errResponse: HttpErrorResponse) => {
              const message: string = 'dosyalar yüklenirken bir hata oldu';
              this.spinner.hide(SpinnerType.BallAtom)
              if (this.options.isAdminPage) {
                this.alertify.message(message, {
                  messageType: MessageType.Error,
                  position: MessagePosition.TopRight,
                });
              } else {
                this.toastr.message(message, 'Error', {
                  messageType: ToastrMessageType.Error,
                  position: ToastrPosition.TopRight,
                });
              }
            }
          );
      }
    });
  }

}


export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: boolean = false;
}
