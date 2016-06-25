import { Component } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { Subject } from 'rxjs/Subject';
import observableArray = require("data/observable-array");
import {
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

  private rooms = new observableArray.ObservableArray([]);
  private room: RoomInterface = new Room();
  // Add to tuto
  constructor(private _account: AccountApi,  private _router: Router) {
      LoopBackConfig.setBaseURL(BASE_URL);
      LoopBackConfig.setApiVersion(API_VERSION);
  }

  ngAfterViewInit() {
      this.getRooms();
  }

  private addRoom(): void {
    this._account.createRooms(this._account.getCurrentId(), this.room)
                 .subscribe(()=> this.room = new Room());
  }

  private getRooms(): void {
    this._account.getRooms(this._account.getCurrentId()).subscribe((rooms: Array<Room>) => {
        rooms.forEach(room => this.onRoom(room))
    }); 
      
    this._account.onCreateRooms(this._account.getCurrentId()).subscribe((room: Room) => this.onRoom(room));
    this._account.onLinkRooms(this._account.getCurrentId()).subscribe((room: Room) => this.onRoom(room)); // Add to tuto
  }

  private onRoom(room: Room) { this.rooms.push(room); }

  // Add to tuto
  private join(room: RoomInterface) {
    this._router.navigate([ 'RoomComponent', room ]); 
  }
}