import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
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

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  constructor(
    private httpClientService: HttpClientService,
    private alertify: AlertifyService,
    private toastr: CustomToastrService
  ) {}

  public files: NgxFileDropEntry[];
  @Input() options: Partial<FileUploadOptions>;

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileData: FormData = new FormData();
        for (const file of files) {
          (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
            fileData.append(_file.name, _file, file.relativePath);
          });
        }
        this.httpClientService
          .post(
            {
              controller: this.options.controller,
              action: this.options.action,
              queryString: this.options.queryString,
              headers: new HttpHeaders({ responseType: 'blob' }),
            },
            fileData
          )
          .subscribe(
            (data) => {
              const message: string = 'dosyalar başarıyla yüklendi';
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
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
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
