import {Component} from '@angular/core';
import {MqttService} from 'src/app/services/mqtt.service';
import {Subscription} from "rxjs";


@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.scss']
})
export class BrokerComponent {
  public hostUrl: string = '';
  public isConnected: boolean = false;
  private isConnectedChanged$: Subscription;
  private testHostsChanged$: Subscription;
  private newHost: string = '';
  public selectedHost: string = '';
  private hostUrlChanged$: Subscription;
  public showAddHostPopup: boolean = false;
  public activeButton: string | null = null;
  public hosts: string[] = [];
  public statusMessages: string[] = [];

  constructor(public mqttService: MqttService) {
    this.isConnectedChanged$ = this.mqttService.isConnectedChangedObservable().subscribe(newValue => this.isConnectedChanged(newValue));
    this.testHostsChanged$ = this.mqttService.getTestHostsChangedObservable().subscribe((hosts: string[]) => this.onHostsChanged(hosts));
    this.hostUrlChanged$ = this.mqttService.getHostUrlChangedObservable().subscribe(url => this.onHostUrlChanged(url));

    this.hosts = this.mqttService.getHosts();
    this.hostUrl = mqttService.getHostUrl() || this.hosts[0];
    this.activeButton = this.hosts[0];
    this.selectedHost = this.hosts[0];
    this.statusMessages = this.mqttService.getStatusMessages();
  }

  private onHostsChanged(hosts: string[]): void {
    this.hosts = hosts;
    this.activeButton = this.hosts[0];
    this.selectedHost = this.hosts[0];
  }

  private isConnectedChanged(newValue: boolean): void {
    this.isConnected = newValue;
  }

  public connect(): void {
    this.mqttService.connect();
  }

  public disconnect(): void {
    this.mqttService.disconnect();
  }

  public onClientIdChanged($event: Event): void {
    this.mqttService.setClientId(($event.target as HTMLInputElement).value);
  }

  public addNewHost() {
    this.showAddHostPopup = true;
  }

  public updateNewHost($event: Event) {
    this.newHost = ($event.target as HTMLInputElement).value;

  }

  public closeAddHostPopup(): void {
    this.showAddHostPopup = false;
  }

  public confirmAddHost(): void {
    if (this.newHost !== '') {
      this.mqttService.addTestHost(this.newHost);
      this.selectedHost = this.newHost;
      this.activeButton = this.newHost;
      this.mqttService.setHostUrl(this.newHost);
      this.showAddHostPopup = false;
    }
  }

  public onHostChosen($event: Event): void {
    this.selectedHost = ($event.target as HTMLElement).innerText;
    this.activeButton = this.selectedHost;
    this.mqttService.setHostUrl(this.selectedHost);
  }


  public onHostToDeleteChosen(): void {
    if (this.selectedHost !== '') {
      const index = this.hosts.indexOf(this.selectedHost);
      if (index !== -1) {
        this.mqttService.removeTestHost(this.selectedHost);
        this.hosts.splice(index, 1);
        this.selectedHost = this.hosts[0];
        this.activeButton = this.selectedHost;
        this.mqttService.setHostUrl(this.selectedHost);
      }
    }
  }

  public generateNewClientId() : void {
    this.mqttService.generateNewClientId();
  }

  private onHostUrlChanged(url: string) : void {
    this.hostUrl = url;
  }
}
