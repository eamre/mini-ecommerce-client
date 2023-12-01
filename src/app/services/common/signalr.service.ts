import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private _connection: HubConnection;
  get connection():HubConnection{
    return this._connection;
  }

  start(hubUrl: string){
    if (!this._connection || this._connection?.state == HubConnectionState.Disconnected) {
      this._connection = new HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect()
        .build();

      this._connection.start()
        .then(() =>
          console.log('SignalR bağlantısı başarıyla başlatıldı.'))
        .catch((err) => setTimeout(() => this.start(hubUrl), 2000));
    }
      this._connection?.onreconnected((connectionId: string) => console.log("Reconnected"));
      this._connection?.onreconnecting(err => console.log("Reconnecting"));
      this._connection?.onclose(err => console.log("Close reconnection"));
  }

  invoke(methodName: string, message:any,
    successCallBack?:(value)=> void, errorCallBack?:(error)=>void){
      this._connection.invoke(methodName, message)
        .then(successCallBack)
        .catch(errorCallBack)
  }

  on(methodName: string, cb:(...message: any[]) => void){
    this._connection?.on(methodName, cb)
  }
}
