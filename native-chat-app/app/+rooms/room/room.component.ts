import { Component } from '@angular/core';
import { Router, RouteParams } from '@angular/router-deprecated';
import {
  LoopBackConfig,
  Room,
  RoomInterface,
  RoomApi,
  Account,
  AccountApi,
  AccountInterface,
  Message,
  MessageInterface,
  BASE_URL,
  API_VERSION
} from '../../shared'; // Add to tuto
import observableArray = require("data/observable-array");

@Component({
  selector: 'room',
  templateUrl: '+rooms/room/room.component.html',
  styleUrls: ['+rooms/room/room.component.css'],
  providers: []
})

export class RoomComponent {

  private loggedId: any;
  private member: Account = new Account();
  private room: RoomInterface = new Room();
  private message: MessageInterface = new Message();
  private messages = new observableArray.ObservableArray([]);
  private members = new observableArray.ObservableArray([]);

  constructor(private _account: AccountApi, private _room: RoomApi, private _params: RouteParams,  private _router: Router) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.loggedId = this._account.getCurrentId();
  }

  ngAfterViewInit() {
    this.getRoom(this._params.get('id'));
  }

  getRoom(id: any): void {
    this._room.findById(id, {
      include: {
        relation: 'accounts',
        scope: { order: 'id DESC' }
      }
     }).subscribe((room: Room) => {
      this.room = room;
      this.getMessages();
      this.room['accounts'].forEach(account => this.members.push(account));
    }, err => alert(err));
  }

  sendMessage(): void {
    this.message.accountId = this._account.getCurrentId();
    this._room.createMessages(this.room.id, this.message).subscribe(() => this.message = new Message(), err => alert(err));
  }

  getMessages(): void {
    this._room.getMessages(this.room.id, {
      order: 'id DESC',
      include: 'account'
    }).subscribe((messages: Array<Message>) => {
      messages.forEach(message => this.messages.push(message));
    });

    this._room.onCreateMessages(this.room.id).subscribe((message: Message) => {
      console.log('onCreate', JSON.stringify(message));
      this.messages.unshift(message);
    });

    this._room.onLinkAccounts(this.room.id).subscribe((account: Account) => {
      console.log('onLinkAccount', JSON.stringify(account));
       this.members.unshift(account)
    });
  }

  addMember(): void {
    this._account.findOne({ where: this.member }).subscribe((member: AccountInterface) => {
      if (!member.id) return alert('Member not found');
      this._room.linkAccounts(this.room.id, member.id).subscribe(res => (this.member = new Account()), err => alert(err));
    }, err => alert(err))
  }
}