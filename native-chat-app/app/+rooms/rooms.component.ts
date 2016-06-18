import { Component } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import {
  LoopBackConfig,
  Room,
  AccountApi,
  BASE_URL,
  API_VERSION
} from '../shared';

@Component({
  selector: 'rooms',
  templateUrl: '+rooms/rooms.component.html',
  providers: []
})

export class RoomsComponent {

  private room: Room = new Room();
  private rooms: Array<Room> = new Array();

  constructor(private _account: AccountApi) {
      LoopBackConfig.setBaseURL(BASE_URL);
      LoopBackConfig.setApiVersion(API_VERSION);
      this.getRooms();
  }

  private addRoom(): void {
    this._account.createRooms(this._account.getCurrentId(), this.room)
                 .subscribe(()=> this.room = new Room());
  }

  private getRooms(): void {
    this._account.getRooms(this._account.getCurrentId()).subscribe((rooms: Array<Room>) => {
        this.rooms = rooms;
    });
      
    this._account.onCreateRooms(this._account.getCurrentId()).subscribe((room: Room) => {
        this.rooms.push(room);
    });
  }
}