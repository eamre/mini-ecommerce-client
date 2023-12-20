import { Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor(@Inject("baseSignalRUrl")private baseSignalRUrl:string){
  }

  start(hubUrl: string) {
    hubUrl = this.baseSignalRUrl + hubUrl;

    let connection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() =>
        console.log('SignalR bağlantısı başarıyla başlatıldı.'))
      .catch((err) => setTimeout(() => this.start(hubUrl), 2000));

    connection?.onreconnected((connectionId: string) => console.log("Reconnected"));
    connection?.onreconnecting(err => console.log("Reconnecting"));
    connection?.onclose(err => console.log("Close reconnection"));

    return connection
  }

  invoke(hubUrl: string, methodName: string, message:any,
    successCallBack?:(value)=> void, errorCallBack?:(error)=>void){
      this.start(hubUrl).invoke(methodName, message)
        .then(successCallBack)
        .catch(errorCallBack)
  }

  on(hubUrl: string, methodName: string, cb:(...message: any[]) => void){
    this.start(hubUrl).on(methodName, cb)
  }
}
