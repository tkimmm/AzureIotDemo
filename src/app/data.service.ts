import { Injectable } from '@angular/core';
import { Observable, Subject,BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as SignalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';


export interface IotHubPayload {
  messageId: number;
  temperature?: number;
  humidity?: number;

}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private hubConnection: SignalR.HubConnection;
  
  iotHubData: Subject<IotHubPayload> = new Subject();
  
  tempStorage$ = new BehaviorSubject(null)
  humidStorage$ = new BehaviorSubject(null)

  constructor(private http: HttpClient) {}

  checkIotObj(iotObj): void {
    if (Object.keys(iotObj).length == 4) {
      this.tempStorage$.next(iotObj.temperature);
      this.humidStorage$.next(iotObj.humidity);
    } else if (Object.keys(iotObj).includes('temperature')) {
      this.tempStorage$.next(iotObj.temperature);
    } else if (Object.keys(iotObj).includes('humidity')) {
      this.humidStorage$.next(iotObj.humidity);
    } else {
      console.log('nothing found.. using cached value')
    }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  
  getTempStorage(): number {
    return this.tempStorage$.getValue()
  }

  getHumidStorage(): number {
    return this.humidStorage$.getValue()
  }

  getCurrentDateTime(): string {
    let date = new Date();
    let time = date.getUTCDate() + "/" + Number(date.getUTCMonth() + 1) + "  " + date.toLocaleTimeString()
    return time
  }

  private getSignalRConnection(): Observable<any> {
  return this.http.post<any>(environment.signalR,{});
  }

  getSignalR(): void {
    this.getSignalRConnection().subscribe(con => {
      const options = {
        accessTokenFactory: () => con.accessToken
  };

    this.hubConnection = new SignalR.HubConnectionBuilder()
        .withUrl(con.url, options)
        .configureLogging(SignalR.LogLevel.Information)
        .build();

    this.hubConnection.start().catch(error => console.error(error));

    this.hubConnection.on('notify', async data => {
        console.log(data)
        await this.checkIotObj(data)
        this.iotHubData.next(data);
      });
    });
  }

  stopSignalR(): void{
    this.hubConnection.stop()
    console.log('connection closed')
  }
}
