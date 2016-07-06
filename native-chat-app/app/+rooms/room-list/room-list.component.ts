import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ObservableArray } from 'data/observable-array';
import { Animation } from "ui/animation";
import { View } from "ui/core/view";
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
  @ViewChild("roomsContainer") roomsContainer: ElementRef;
  private rooms: ObservableArray<RoomInterface>;
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
      this._account.getRooms(this._account.getCurrentId(), {
        order: 'id DESC'
      }).subscribe((rooms: Array<Room>) => {
          this.rooms = new ObservableArray<RoomInterface>(rooms);
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

  private join(e) {
    this._router.navigate([ '/rooms',  this.rooms.getItem(e.index).id ]); 
  }

  private signout() {
    this._account.logout().subscribe(() => this._router.navigate(['/sign']));
  }
}