import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { HubUrls } from 'src/app/constants/hub-urls';
import { ReceiveFunctions } from 'src/app/constants/receive-functions';
import { AlertifyService, MessagePosition, MessageType } from 'src/app/services/admin/alertify.service';
import { SignalRService } from 'src/app/services/common/signalr.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private signalRService: SignalRService, private alertify:AlertifyService) {
    super(spinner);
    this.signalRService.start(HubUrls.OrderHub)
    this.signalRService.start(HubUrls.ProductHub)
  }

  ngOnInit(): void {
    this.signalRService.on(HubUrls.ProductHub,ReceiveFunctions.ProductAddedMessageReceiveFunction,
      message => {
        this.alertify.message(message, {
          messageType: MessageType.Notify,
          position: MessagePosition.TopRight
        })
      })

    this.signalRService.on(HubUrls.OrderHub,ReceiveFunctions.OrderAddedMessageReceiveFunction,
      message => {
        this.alertify.message(message, {
          messageType: MessageType.Notify,
          position: MessagePosition.TopRight
        })
      })
  }

}
