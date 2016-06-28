import { Component } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { Subject } from 'rxjs/Subject';
import { ObservableArray } from 'data/observable-array';
import {
  LoggerService,
  LoopBackConfig,
  Room,
  AccountApi,
  RoomInterface,
  BASE_URL,
  API_VERSION
} from '../../shared';

@Component({
  selector: 'room-list',
  templateUrl: '+rooms/room-list/room-list.component.html',
  providers: []
})

export class RoomsComponent {

  private rooms: ObservableArray<Room>;
  private room: RoomInterface = new Room();
  private subscriptions = new Array();
  // Add to tuto
  constructor(
    private _account: AccountApi,
    private _router: Router,
    private _logger: LoggerService
  ) {
      LoopBackConfig.setBaseURL(BASE_URL);
      LoopBackConfig.setApiVersion(API_VERSION);
      this._logger.info('Room List Component is Loaded');
  }

  ngAfterViewInit() {
      this.getRooms();
  }

  onOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private addRoom(): void {
    this.subscriptions.push(
      this._account.createRooms(this._account.getCurrentId(), this.room)
                   .subscribe(()  => this.room = new Room(), err => alert(err))
    );
  }

  private getRooms(): void {
    this.subscriptions.push(
      this._account.getRooms(this._account.getCurrentId()).subscribe((rooms: Array<Room>) => {
          this.rooms = new ObservableArray<Room>(rooms);
      })
    ); 
    this.subscriptions.push(
      this._account.onCreateRooms(this._account.getCurrentId())
                   .subscribe((room: Room) => this.onRoom(room))
    );
    this.subscriptions.push(
      this._account.onLinkRooms(this._account.getCurrentId())
                   .subscribe((room: Room) => this.onRoom(room))
    );
  }

  private onRoom(room: Room) { this.rooms.push(room); }

  private join(room: RoomInterface) {
    this._router.navigate([ 'RoomComponent', room ]); 
  }
}