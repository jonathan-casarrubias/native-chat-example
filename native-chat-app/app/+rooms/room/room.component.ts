import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ObservableArray } from 'data/observable-array';
import {
  LoopBackConfig,
  Room,
  RoomApi,
  RoomInterface,
  Account,
  AccountApi,
  AccountInterface,
  Message,
  MessageInterface,
  BASE_URL,
  API_VERSION,
  LoggerService
} from '../../shared';

@Component({
  selector   : 'room',
  templateUrl: '+rooms/room/room.component.html',
  styleUrls  : ['+rooms/room/room.component.css'],
  providers  : []
})

export class RoomComponent {

  private loggedId: number | string;
  private room    : RoomInterface = new Room();
  private member  : AccountInterface = new Account();
  private message : MessageInterface = new Message();
  private messages: ObservableArray<Message>;
  private members : ObservableArray<Account>;
  private subscriptions = new Array();

  constructor(
    private _account: AccountApi,
    private _room   : RoomApi,
    private _route   : ActivatedRoute,
    private _router : Router,
    private _logger : LoggerService
  ) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.loggedId = this._account.getCurrentId();
    this._logger.info('Room Component is Loaded');
  }

  ngAfterViewInit() {
    this._route.params.subscribe(params => this.getRoom(+params['id']));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getRoom(id: any): void {
    this.subscriptions.push(
      this._room.findById(id, {
        include: {
          relation: 'accounts',
          scope: { order: 'id DESC' }
        }
      }).subscribe((room: Room) => {
        this.room = room;
        this.getMessages();
        this.subscribe();
        this.members  = new ObservableArray<Account>(this.room['accounts']);
      }, err => alert(err))
    );
  }

  subscribe(): void {
    this.subscriptions.push(
      this._room.onCreateMessages(this.room.id)
                .subscribe((message: Message) => this.messages.unshift(message))
    );

    this.subscriptions.push(
      this._room.onLinkAccounts(this.room.id)
                .subscribe((account: Account) => this.members.unshift(account))
    );
  }

  sendMessage(): void {
    this.message.accountId = this._account.getCurrentId();
    let subscription = this._room.createMessages(this.room.id, this.message)
                .subscribe(
                  () => this.message = new Message(),
                  err => alert(err),
                  () => { subscription.unsubscribe() }
                );
  }

  getMessages(): void {
    this.subscriptions.push(
      this._room.getMessages(this.room.id, {
        order: 'id DESC',
        include: 'account'
      }).subscribe((messages: Array<Message>) => {
        this.messages = new ObservableArray<Message>(messages);
      })
    );
  }

  addMember(): void {
    console.log(JSON.stringify(this.member));
    this.subscriptions.push(
      this._account.findOne({ where: this.member }).subscribe(
        (member: AccountInterface) => this.linkMember(member), 
        err => { 
          alert('Member not found');
          console.log(JSON.stringify(err));
        }
      )
    );
  }

  linkMember(member: AccountInterface): void {
    this.subscriptions.push(
      this._room.linkAccounts(this.room.id, member.id)
                .subscribe(
                  res => (this.member = new Account()), 
                  err => alert(err)
                )
    );
  }
}