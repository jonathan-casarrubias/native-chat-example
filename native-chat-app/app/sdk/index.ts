/**
* @module LoopBack SDK for NativeScript
* @author Jonathan Casarrubias <http://twitter.com/johncasarrubias>
* @description
* This module provide 2 types of communication with a LoopBack API
*
* 1.- Standard RESTful Communication.- HTTP Requests implementing 
*     methods like POST, PUT, GET, DELETE
* 
*     Example: Room.create({});  <-- Creates a new room using REST
*
* 2.- SocketIO Communication (PubSub).- WebSocket Communication for
*     publish subscriptions. 
*
*     Example: Room.createIO().subscribe(); <-- Listen for new rooms
*     using web sockets.
*
* NOTE: Currently Socket Communication is only supported for Android 
* IOS will be added ASAP
*
* NativeScript App_Resources Setup
*
* Make sure you update your App_Resources/Android/app.gradle file by adding
*
* dependencies {
*   compile ('io.socket:socket.io-client:0.7.0') {
*     exclude group: 'org.json', module: 'json'
*   }
* }
**/
/* tslint:disable */
import { Injectable, Inject, Optional } from '@angular/core';
import { Http, Headers, Request, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import * as AppSettings from 'application-settings';

export interface LoopBackFilterInterface {
  fields?: any;
  include?: any;
  limit?: any;
  order?: any;
  skip?: any;
  offset?: any;
  where?: any;
}

var SocketIO = require('nativescript-socket.io');

class SocketConnections {
  private static connections = {};
  static getHandler(url, token: { id: any, userId: any }) {
    if (!SocketConnections.connections[url])
    SocketConnections.connections[url] = SocketIO.connect(url, {
        log: false,
        secure: false,
        forceWebsockets: true,
    });
    SocketConnections.connections[url].on('connect', () => {
      console.log('Connected, trying to authenticate');
      SocketConnections.connections[url].emit('authentication', token);
      SocketConnections.connections[url].on('unauthorized', res => console.error('Unauthenticated', res));
    });
    return SocketConnections.connections[url];
  }
}

export class LoopBackConfig {
  private static path: string;
  private static  version: string | number;

  public static setApiVersion(version: string = "api"): void {
    LoopBackConfig.version = version;
  }
  
  public static getApiVersion(): string | number {
    return LoopBackConfig.version;
  }

  public static setBaseURL(url: string = "/"): void {
    LoopBackConfig.path = url;
  }
  
  public static getPath(): string {
    return LoopBackConfig.path;
  }
}

class LoopBackAuth {
  protected accessTokenId: any;
  protected currentUserId: any;
  protected rememberMe: boolean;
  protected currentUserData: any;

  protected propsPrefix: string = '$LoopBack$';

  constructor() {
    this.accessTokenId = this.load("accessTokenId");
    this.currentUserId = this.load("currentUserId");
    this.rememberMe = this.load("rememberMe");
    this.currentUserData = null;
  }

  public setRememberMe(value: boolean): LoopBackAuth {
    this.rememberMe = value;
    return this;
  }

  public getCurrentUserId(): any {
    return this.currentUserId;
  }

  public setCurrentUserData(data: any): LoopBackAuth {
    this.currentUserData = data;
    return this;
  }

  public getCurrentUserData(): any {
    return this.currentUserData;
  }

  public getAccessTokenId(): any {
    return this.accessTokenId;
  }

  public save() {
    this.saveThis("accessTokenId", this.accessTokenId);
    this.saveThis("currentUserId", this.currentUserId);
    this.saveThis("rememberMe", this.rememberMe);
  };

  public setUser(accessTokenId: any, userId: any, userData: any) {
    this.accessTokenId = accessTokenId;
    this.currentUserId = userId;
    this.currentUserData = userData;
  }

  public clearUser() {
    this.accessTokenId = null;
    this.currentUserId = null;
    this.currentUserData = null;
  }

  public clearStorage() {
    this.saveThis("accessTokenId", null);
    this.saveThis("accessTokenId", null);
    this.saveThis("currentUserId", null);
    this.saveThis("currentUserId", null);
    this.saveThis("rememberMe", null);
    this.saveThis("rememberMe", null);
  };

  // Note: LocalStorage converts the value to string
  // We are using empty string as a marker for null/undefined values.
  protected saveThis(name: string, value: any) {
    try {
      var key = this.propsPrefix + name;
      if (value == null) {
        value = '';
      }
      AppSettings.setString(key, String(value));
    }
    catch(err) {
      console.log('Cannot access local/session storage:', err);
    }
  }

  protected load(name: string): any {
    var key = this.propsPrefix + name;
    return AppSettings.getString(key);
  }
}

let auth = new LoopBackAuth();


/**
 * Default error handler
 */
export class ErrorHandler {
  public handleError(error: Response) {
    return Observable.throw(error.json().error || 'Server error');
  }
}

@Injectable()
export abstract class BaseLoopBackApi {

  protected path: string;
  protected version: string | number;

  constructor(
    @Inject(Http) protected http: Http, 
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    if (!errorHandler) {
      this.errorHandler = new ErrorHandler();
    }
    this.init();
  }

  protected init() {
    LoopBackConfig.setBaseURL("/");
  }

   /**
   * Process request
   * @param string  method    Request method (GET, POST, PUT)
   * @param string  url       Request url (my-host/my-url/:id)
   * @param any     urlParams Values of url parameters
   * @param any     params    Parameters for building url (filter and other)
   * @param any     data      Request body
   * @param boolean isio      Request socket connection
   */
  public request(method: string, url: string, urlParams: any = {},
    params: any = {}, data: any = null, isio: boolean = false) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    if (auth.getAccessTokenId()) {
      headers.append('Authorization', auth.getAccessTokenId());
    }

    let requestUrl = url;
    let key: string;
    for (key in urlParams) {
      requestUrl = requestUrl.replace(new RegExp(":" + key + "(\/|$)", "g"), urlParams[key] + "$1");
    }

    let parameters: string[] = [];
    for (var param in params) {
      parameters.push(param + '=' + (typeof params[param] === 'object' ? JSON.stringify(params[param]) : params[param]));
    }
    requestUrl += (parameters ? '?' : '') + parameters.join('&');

    if (isio) {
      let event = (`[${method}]${requestUrl}`).replace(/\?/, '');
      let subject = new Subject();
      let socket = SocketConnections.getHandler(LoopBackConfig.getPath(), {
        id: auth.getAccessTokenId(),
        userId: auth.getCurrentUserId()
      });
          socket.on(event, res => subject.next(res));
      return subject.asObservable();
    } else {
      let request = new Request({
        headers: headers,
        method: method,
        url: requestUrl,
        body: data ? JSON.stringify(data) : undefined
      });
      return this.http.request(request)
        .map(res => (res.text() != "" ? res.json() : {}))
        .catch(this.errorHandler.handleError);
    }
  }
}

/**
 * Api for the `User` model.
 */
@Injectable()
export class UserApi extends BaseLoopBackApi {

  constructor(
    @Inject(Http) http: Http,
    @Optional() @Inject(ErrorHandler) errorHandler: ErrorHandler
  ) {
    super(http, errorHandler);
  }

  /**
   * Find a related item by id for accessTokens.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for accessTokens
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public __findById__accessTokens(id: any, fk: any) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __findById__accessTokensIO(id: any, fk: any) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Delete a related item by id for accessTokens.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for accessTokens
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __destroyById__accessTokens(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __destroyById__accessTokensIO(id: any, fk: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update a related item by id for accessTokens.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for accessTokens
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public __updateById__accessTokens(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __updateById__accessTokensIO(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Queries accessTokens of User.
   *
   * @param any id User id
   *
   * @param object filter 
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public __get__accessTokens(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __get__accessTokensIO(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Creates a new instance in accessTokens of this model.
   *
   * @param any id User id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public __create__accessTokens(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __create__accessTokensIO(id: any, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Deletes all accessTokens of this model.
   *
   * @param any id User id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __delete__accessTokens(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __delete__accessTokensIO(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Counts accessTokens of User.
   *
   * @param any id User id
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public __count__accessTokens(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __count__accessTokensIO(id: any, where: any = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public create(data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public createIO(data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public createMany(data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public createManyIO(data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Update an existing model instance or insert a new one into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public upsert(data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public upsertIO(data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Check whether a model instance exists in the data source.
   *
   * @param any id Model id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `exists` – `{boolean}` - 
   */
  public exists(id: any) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/exists";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public existsIO(id: any) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/exists";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find a model instance by id from the data source.
   *
   * @param any id Model id
   *
   * @param object filter Filter defining fields and include
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public findById(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public findByIdIO(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find all instances of the model matched by filter from the data source.
   *
   * @param object filter Filter defining fields, where, include, order, offset, and limit
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public find(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public findIO(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find first instance of the model matched by filter from the data source.
   *
   * @param object filter Filter defining fields, where, include, order, offset, and limit
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public findOne(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/findOne";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public findOneIO(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/findOne";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update instances of the model matched by where from the data source.
   *
   * @param object where Criteria to match model instances
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * The number of instances updated
   */
  public updateAll(where: any = undefined, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/update";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public updateAllIO(where: any = undefined, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/update";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Delete a model instance by id from the data source.
   *
   * @param any id Model id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public deleteById(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public deleteByIdIO(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Count instances of the model matched by where from the data source.
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public count(where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/count";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public countIO(where: any = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/count";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update attributes for a model instance and persist it into the data source.
   *
   * @param any id User id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public updateAttributes(id: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public updateAttributesIO(id: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Create a change stream.
   *
   * @param object data Request data.
   *
   *  - `options` – `{object}` - 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `changes` – `{ReadableStream}` - 
   */
  public createChangeStream(options: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/change-stream";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, options);
    return result;
  }

  public createChangeStreamIO(options: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/change-stream";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, options, true);
    return result;
  }

  /**
   * Login a user with username/email and password.
   *
   * @param string include Related objects to include in the response. See the description of return value for more details.
   *   Default value: `user`.
   *
   *  - `rememberMe` - `boolean` - Whether the authentication credentials
   *     should be remembered in localStorage across app/browser restarts.
   *     Default: `true`.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * The response body contains properties of the AccessToken created on login.
   * Depending on the value of `include` parameter, the body may contain additional properties:
   * 
   *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
   * 
   *
   */
  public login(credentials: any, include: any = "user") {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/login";
    let urlParams: any = {
    };

    let params: any = {};
    if (include !== undefined) {
      params.include = include;
    }


    this.logout();


    let result = this.request(method, url, urlParams, params, credentials)
      .share();
      result.subscribe(
        (response: { id: string, userId: string, user: any }) => {
          auth.setUser(response.id, response.userId, response.user);
          auth.setRememberMe(true);
          auth.save();
        },
        () => null
      );
    return result;
  }

  public loginIO(credentials: any, include: any = "user") {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/login";
    let urlParams: any = {
    };

    let params: any = {};
    if (include !== undefined) {
      params.include = include;
    }
    let result = this.request(method, url, urlParams, params, credentials, true)
      .share();
      result.subscribe(
        (response: { id: string, userId: string, user: any }) => {
          auth.setUser(response.id, response.userId, response.user);
          auth.setRememberMe(true);
          auth.save();
        },
        () => null
      );
    return result;
  }

  /**
   * Logout a user with access token.
   *
   * @param object data Request data.
   *
   *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public logout() {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/logout";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params)
      .share();
      result.subscribe(
        () => {
          auth.clearUser();
          auth.clearStorage();
        },
        () => null
      );
    return result;
  }

  public logoutIO() {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/logout";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true)
      .share();
      result.subscribe(
        () => {
          auth.clearUser();
          auth.clearStorage();
        },
        () => null
      );
    return result;
  }

  /**
   * Confirm a user registration with email verification token.
   *
   * @param string uid 
   *
   * @param string token 
   *
   * @param string redirect 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public confirm(uid: string, token: string, redirect: string = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/confirm";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public confirmIO(uid: string, token: string, redirect: string = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/confirm";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Reset password for a user with email.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public resetPassword(options: any) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/reset";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, options);
    return result;
  }

  public resetPasswordIO(options: any) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/Users/reset";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, options, true);
    return result;
  }

  /**
   * @ngdoc method
   * @name lbServices.User#getCurrent
   * @methodOf lbServices.User
   *
   * @description
   *
   * Get data of the currently logged user. Fail with HTTP result 401
   * when there is no user logged in.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   */
  public getCurrent(): any {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/Users" + "/:id";
    let id: any = auth.getCurrentUserId();
    if (id == null) {
      id = '__anonymous__';
    }
    let urlParams: any = {
      id: id
    };

    let result = this.request(method, url, urlParams)
      .share();
      result.subscribe(
        (response: { resource: any }) => {
          auth.setCurrentUserData(response);
          return response.resource;
        },
        () => null
      );
    return result;
  }

  /**
   * Get data of the currently logged user that was returned by the last
   * call to {@link lbServices.User#login} or
   * {@link lbServices.User#getCurrent}. Return null when there
   * is no user logged in or the data of the current user were not fetched
   * yet.
   *
   * @returns object A User instance.
   */
  public getCachedCurrent() {
    return auth.getCurrentUserData();
  }

  /**
   * @name lbServices.User#isAuthenticated
   *
   * @returns {boolean} True if the current user is authenticated (logged in).
   */
  public isAuthenticated() {
    return this.getCurrentId() != null;
  }

  /**
   * @name lbServices.User#getCurrentId
   *
   * @returns object Id of the currently logged-in user or null.
   */
  public getCurrentId() {
    return auth.getCurrentUserId();
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `User`.
   */
  public getModelName() {
    return "User";
  }
}

/**
 * Api for the `Account` model.
 */
@Injectable()
export class AccountApi extends BaseLoopBackApi {

  constructor(
    @Inject(Http) http: Http,
    @Optional() @Inject(ErrorHandler) errorHandler: ErrorHandler
  ) {
    super(http, errorHandler);
  }

  /**
   * Find a related item by id for accessTokens.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for accessTokens
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __findById__accessTokens(id: any, fk: any) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __findById__accessTokensIO(id: any, fk: any) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Delete a related item by id for accessTokens.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for accessTokens
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __destroyById__accessTokens(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __destroyById__accessTokensIO(id: any, fk: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update a related item by id for accessTokens.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for accessTokens
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __updateById__accessTokens(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __updateById__accessTokensIO(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Find a related item by id for rooms.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for rooms
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __findById__rooms(id: any, fk: any) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __findById__roomsIO(id: any, fk: any) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Delete a related item by id for rooms.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for rooms
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __destroyById__rooms(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __destroyById__roomsIO(id: any, fk: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update a related item by id for rooms.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for rooms
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __updateById__rooms(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __updateById__roomsIO(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Add a related item by id for rooms.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for rooms
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __link__rooms(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __link__roomsIO(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Remove the rooms relation to an item by id.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for rooms
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __unlink__rooms(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __unlink__roomsIO(id: any, fk: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Check the existence of rooms relation to an item by id.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for rooms
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __exists__rooms(id: any, fk: any) {
    let method: string = "HEAD";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __exists__roomsIO(id: any, fk: any) {
    let method: string = "HEAD";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find a related item by id for messages.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for messages
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __findById__messages(id: any, fk: any) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __findById__messagesIO(id: any, fk: any) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Delete a related item by id for messages.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for messages
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __destroyById__messages(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __destroyById__messagesIO(id: any, fk: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update a related item by id for messages.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for messages
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __updateById__messages(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __updateById__messagesIO(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Queries accessTokens of Account.
   *
   * @param any id User id
   *
   * @param object filter 
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __get__accessTokens(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __get__accessTokensIO(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Creates a new instance in accessTokens of this model.
   *
   * @param any id User id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __create__accessTokens(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __create__accessTokensIO(id: any, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Deletes all accessTokens of this model.
   *
   * @param any id User id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __delete__accessTokens(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __delete__accessTokensIO(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Counts accessTokens of Account.
   *
   * @param any id User id
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public __count__accessTokens(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __count__accessTokensIO(id: any, where: any = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Queries rooms of Account.
   *
   * @param any id User id
   *
   * @param object filter 
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __get__rooms(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __get__roomsIO(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Creates a new instance in rooms of this model.
   *
   * @param any id User id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __create__rooms(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __create__roomsIO(id: any, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Deletes all rooms of this model.
   *
   * @param any id User id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __delete__rooms(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __delete__roomsIO(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Counts rooms of Account.
   *
   * @param any id User id
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public __count__rooms(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __count__roomsIO(id: any, where: any = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Queries messages of Account.
   *
   * @param any id User id
   *
   * @param object filter 
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __get__messages(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __get__messagesIO(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Creates a new instance in messages of this model.
   *
   * @param any id User id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __create__messages(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __create__messagesIO(id: any, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Deletes all messages of this model.
   *
   * @param any id User id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __delete__messages(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __delete__messagesIO(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Counts messages of Account.
   *
   * @param any id User id
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public __count__messages(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __count__messagesIO(id: any, where: any = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public create(data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public createIO(data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public createMany(data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public createManyIO(data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Update an existing model instance or insert a new one into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public upsert(data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public upsertIO(data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Check whether a model instance exists in the data source.
   *
   * @param any id Model id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `exists` – `{boolean}` - 
   */
  public exists(id: any) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/exists";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public existsIO(id: any) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/exists";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find a model instance by id from the data source.
   *
   * @param any id Model id
   *
   * @param object filter Filter defining fields and include
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public findById(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public findByIdIO(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find all instances of the model matched by filter from the data source.
   *
   * @param object filter Filter defining fields, where, include, order, offset, and limit
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public find(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public findIO(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find first instance of the model matched by filter from the data source.
   *
   * @param object filter Filter defining fields, where, include, order, offset, and limit
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public findOne(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/findOne";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public findOneIO(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/findOne";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update instances of the model matched by where from the data source.
   *
   * @param object where Criteria to match model instances
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * The number of instances updated
   */
  public updateAll(where: any = undefined, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/update";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public updateAllIO(where: any = undefined, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/update";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Delete a model instance by id from the data source.
   *
   * @param any id Model id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public deleteById(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public deleteByIdIO(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Count instances of the model matched by where from the data source.
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public count(where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/count";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public countIO(where: any = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/count";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update attributes for a model instance and persist it into the data source.
   *
   * @param any id User id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public updateAttributes(id: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public updateAttributesIO(id: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Create a change stream.
   *
   * @param object data Request data.
   *
   *  - `options` – `{object}` - 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `changes` – `{ReadableStream}` - 
   */
  public createChangeStream(options: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/change-stream";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, options);
    return result;
  }

  public createChangeStreamIO(options: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/change-stream";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, options, true);
    return result;
  }

  /**
   * Login a user with username/email and password.
   *
   * @param string include Related objects to include in the response. See the description of return value for more details.
   *   Default value: `user`.
   *
   *  - `rememberMe` - `boolean` - Whether the authentication credentials
   *     should be remembered in localStorage across app/browser restarts.
   *     Default: `true`.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * The response body contains properties of the AccessToken created on login.
   * Depending on the value of `include` parameter, the body may contain additional properties:
   * 
   *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
   * 
   *
   */
  public login(credentials: any, include: any = "user") {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/login";
    let urlParams: any = {
    };

    let params: any = {};
    if (include !== undefined) {
      params.include = include;
    }


    this.logout();


    let result = this.request(method, url, urlParams, params, credentials)
      .share();
      result.subscribe(
        (response: { id: string, userId: string, user: any }) => {
          auth.setUser(response.id, response.userId, response.user);
          auth.setRememberMe(true);
          auth.save();
        },
        () => null
      );
    return result;
  }

  public loginIO(credentials: any, include: any = "user") {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/login";
    let urlParams: any = {
    };

    let params: any = {};
    if (include !== undefined) {
      params.include = include;
    }
    let result = this.request(method, url, urlParams, params, credentials, true)
      .share();
      result.subscribe(
        (response: { id: string, userId: string, user: any }) => {
          auth.setUser(response.id, response.userId, response.user);
          auth.setRememberMe(true);
          auth.save();
        },
        () => null
      );
    return result;
  }

  /**
   * Logout a user with access token.
   *
   * @param object data Request data.
   *
   *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public logout() {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/logout";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params)
      .share();
      result.subscribe(
        () => {
          auth.clearUser();
          auth.clearStorage();
        },
        () => null
      );
    return result;
  }

  public logoutIO() {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/logout";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true)
      .share();
      result.subscribe(
        () => {
          auth.clearUser();
          auth.clearStorage();
        },
        () => null
      );
    return result;
  }

  /**
   * Confirm a user registration with email verification token.
   *
   * @param string uid 
   *
   * @param string token 
   *
   * @param string redirect 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public confirm(uid: string, token: string, redirect: string = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/confirm";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public confirmIO(uid: string, token: string, redirect: string = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/confirm";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Reset password for a user with email.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public resetPassword(options: any) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/reset";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, options);
    return result;
  }

  public resetPasswordIO(options: any) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/reset";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, options, true);
    return result;
  }

  /**
   * Find a related item by id for accounts.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for accounts
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __findById__Room__accounts(id: any, fk: any) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __findById__Room__accountsIO(id: any, fk: any) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Delete a related item by id for accounts.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for accounts
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __destroyById__Room__accounts(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __destroyById__Room__accountsIO(id: any, fk: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update a related item by id for accounts.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for accounts
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __updateById__Room__accounts(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __updateById__Room__accountsIO(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Add a related item by id for accounts.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for accounts
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __link__Room__accounts(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __link__Room__accountsIO(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Remove the accounts relation to an item by id.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for accounts
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __unlink__Room__accounts(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __unlink__Room__accountsIO(id: any, fk: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Check the existence of accounts relation to an item by id.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for accounts
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __exists__Room__accounts(id: any, fk: any) {
    let method: string = "HEAD";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __exists__Room__accountsIO(id: any, fk: any) {
    let method: string = "HEAD";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Queries accounts of Room.
   *
   * @param any id PersistedModel id
   *
   * @param object filter 
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __get__Room__accounts(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __get__Room__accountsIO(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Creates a new instance in accounts of this model.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __create__Room__accounts(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __create__Room__accountsIO(id: any, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Creates a new instance in accounts of this model.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __createMany__Room__accounts(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __createMany__Room__accountsIO(id: any, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Deletes all accounts of this model.
   *
   * @param any id PersistedModel id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __delete__Room__accounts(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __delete__Room__accountsIO(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Counts accounts of Room.
   *
   * @param any id PersistedModel id
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public __count__Room__accounts(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __count__Room__accountsIO(id: any, where: any = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Fetches belongsTo relation account.
   *
   * @param any id PersistedModel id
   *
   * @param boolean refresh 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Account` object.)
   * </em>
   */
  public __get__Message__account(id: any, refresh: boolean = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id/account";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (refresh !== undefined) {
      params.refresh = refresh;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __get__Message__accountIO(id: any, refresh: boolean = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages/:id/account";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (refresh !== undefined) {
      params.refresh = refresh;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * @ngdoc method
   * @name lbServices.Account#getCurrent
   * @methodOf lbServices.Account
   *
   * @description
   *
   * Get data of the currently logged user. Fail with HTTP result 401
   * when there is no user logged in.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   */
  public getCurrent(): any {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/accounts" + "/:id";
    let id: any = auth.getCurrentUserId();
    if (id == null) {
      id = '__anonymous__';
    }
    let urlParams: any = {
      id: id
    };

    let result = this.request(method, url, urlParams)
      .share();
      result.subscribe(
        (response: { resource: any }) => {
          auth.setCurrentUserData(response);
          return response.resource;
        },
        () => null
      );
    return result;
  }

  /**
   * Get data of the currently logged user that was returned by the last
   * call to {@link lbServices.Account#login} or
   * {@link lbServices.Account#getCurrent}. Return null when there
   * is no user logged in or the data of the current user were not fetched
   * yet.
   *
   * @returns object A Account instance.
   */
  public getCachedCurrent() {
    return auth.getCurrentUserData();
  }

  /**
   * @name lbServices.Account#isAuthenticated
   *
   * @returns {boolean} True if the current user is authenticated (logged in).
   */
  public isAuthenticated() {
    return this.getCurrentId() != null;
  }

  /**
   * @name lbServices.Account#getCurrentId
   *
   * @returns object Id of the currently logged-in user or null.
   */
  public getCurrentId() {
    return auth.getCurrentUserId();
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `Account`.
   */
  public getModelName() {
    return "Account";
  }
}

/**
 * Api for the `Room` model.
 */
@Injectable()
export class RoomApi extends BaseLoopBackApi {

  constructor(
    @Inject(Http) http: Http,
    @Optional() @Inject(ErrorHandler) errorHandler: ErrorHandler
  ) {
    super(http, errorHandler);
  }

  /**
   * Find a related item by id for accounts.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for accounts
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __findById__accounts(id: any, fk: any) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __findById__accountsIO(id: any, fk: any) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Delete a related item by id for accounts.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for accounts
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __destroyById__accounts(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __destroyById__accountsIO(id: any, fk: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update a related item by id for accounts.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for accounts
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __updateById__accounts(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __updateById__accountsIO(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Add a related item by id for accounts.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for accounts
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __link__accounts(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __link__accountsIO(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Remove the accounts relation to an item by id.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for accounts
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __unlink__accounts(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __unlink__accountsIO(id: any, fk: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Check the existence of accounts relation to an item by id.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for accounts
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __exists__accounts(id: any, fk: any) {
    let method: string = "HEAD";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __exists__accountsIO(id: any, fk: any) {
    let method: string = "HEAD";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find a related item by id for messages.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for messages
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __findById__messages(id: any, fk: any) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __findById__messagesIO(id: any, fk: any) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Delete a related item by id for messages.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for messages
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __destroyById__messages(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __destroyById__messagesIO(id: any, fk: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update a related item by id for messages.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for messages
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __updateById__messages(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __updateById__messagesIO(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Queries accounts of Room.
   *
   * @param any id PersistedModel id
   *
   * @param object filter 
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __get__accounts(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __get__accountsIO(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Creates a new instance in accounts of this model.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __create__accounts(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __create__accountsIO(id: any, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Deletes all accounts of this model.
   *
   * @param any id PersistedModel id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __delete__accounts(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __delete__accountsIO(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Counts accounts of Room.
   *
   * @param any id PersistedModel id
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public __count__accounts(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __count__accountsIO(id: any, where: any = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Queries messages of Room.
   *
   * @param any id PersistedModel id
   *
   * @param object filter 
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __get__messages(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __get__messagesIO(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Creates a new instance in messages of this model.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __create__messages(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __create__messagesIO(id: any, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Deletes all messages of this model.
   *
   * @param any id PersistedModel id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __delete__messages(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __delete__messagesIO(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Counts messages of Room.
   *
   * @param any id PersistedModel id
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public __count__messages(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __count__messagesIO(id: any, where: any = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public create(data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public createIO(data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public createMany(data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public createManyIO(data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Update an existing model instance or insert a new one into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public upsert(data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public upsertIO(data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Check whether a model instance exists in the data source.
   *
   * @param any id Model id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `exists` – `{boolean}` - 
   */
  public exists(id: any) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/exists";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public existsIO(id: any) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/exists";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find a model instance by id from the data source.
   *
   * @param any id Model id
   *
   * @param object filter Filter defining fields and include
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public findById(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public findByIdIO(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find all instances of the model matched by filter from the data source.
   *
   * @param object filter Filter defining fields, where, include, order, offset, and limit
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public find(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public findIO(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find first instance of the model matched by filter from the data source.
   *
   * @param object filter Filter defining fields, where, include, order, offset, and limit
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public findOne(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/findOne";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public findOneIO(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/findOne";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update instances of the model matched by where from the data source.
   *
   * @param object where Criteria to match model instances
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * The number of instances updated
   */
  public updateAll(where: any = undefined, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/update";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public updateAllIO(where: any = undefined, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/update";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Delete a model instance by id from the data source.
   *
   * @param any id Model id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public deleteById(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public deleteByIdIO(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Count instances of the model matched by where from the data source.
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public count(where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/count";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public countIO(where: any = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/count";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update attributes for a model instance and persist it into the data source.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public updateAttributes(id: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public updateAttributesIO(id: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Create a change stream.
   *
   * @param object data Request data.
   *
   *  - `options` – `{object}` - 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `changes` – `{ReadableStream}` - 
   */
  public createChangeStream(options: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/change-stream";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, options);
    return result;
  }

  public createChangeStreamIO(options: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/change-stream";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, options, true);
    return result;
  }

  /**
   * Find a related item by id for rooms.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for rooms
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __findById__Account__rooms(id: any, fk: any) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __findById__Account__roomsIO(id: any, fk: any) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Delete a related item by id for rooms.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for rooms
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __destroyById__Account__rooms(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __destroyById__Account__roomsIO(id: any, fk: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update a related item by id for rooms.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for rooms
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __updateById__Account__rooms(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __updateById__Account__roomsIO(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Add a related item by id for rooms.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for rooms
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __link__Account__rooms(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __link__Account__roomsIO(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Remove the rooms relation to an item by id.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for rooms
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __unlink__Account__rooms(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __unlink__Account__roomsIO(id: any, fk: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Check the existence of rooms relation to an item by id.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for rooms
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __exists__Account__rooms(id: any, fk: any) {
    let method: string = "HEAD";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __exists__Account__roomsIO(id: any, fk: any) {
    let method: string = "HEAD";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Queries rooms of Account.
   *
   * @param any id User id
   *
   * @param object filter 
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __get__Account__rooms(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __get__Account__roomsIO(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Creates a new instance in rooms of this model.
   *
   * @param any id User id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __create__Account__rooms(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __create__Account__roomsIO(id: any, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Creates a new instance in rooms of this model.
   *
   * @param any id User id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __createMany__Account__rooms(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __createMany__Account__roomsIO(id: any, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Deletes all rooms of this model.
   *
   * @param any id User id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __delete__Account__rooms(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __delete__Account__roomsIO(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Counts rooms of Account.
   *
   * @param any id User id
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public __count__Account__rooms(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __count__Account__roomsIO(id: any, where: any = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Fetches belongsTo relation room.
   *
   * @param any id PersistedModel id
   *
   * @param boolean refresh 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public __get__Message__room(id: any, refresh: boolean = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id/room";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (refresh !== undefined) {
      params.refresh = refresh;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __get__Message__roomIO(id: any, refresh: boolean = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages/:id/room";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (refresh !== undefined) {
      params.refresh = refresh;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }


  /**
   * The name of the model represented by this $resource,
   * i.e. `Room`.
   */
  public getModelName() {
    return "Room";
  }
}

/**
 * Api for the `Message` model.
 */
@Injectable()
export class MessageApi extends BaseLoopBackApi {

  constructor(
    @Inject(Http) http: Http,
    @Optional() @Inject(ErrorHandler) errorHandler: ErrorHandler
  ) {
    super(http, errorHandler);
  }

  /**
   * Fetches belongsTo relation room.
   *
   * @param any id PersistedModel id
   *
   * @param boolean refresh 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public __get__room(id: any, refresh: boolean = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id/room";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (refresh !== undefined) {
      params.refresh = refresh;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __get__roomIO(id: any, refresh: boolean = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages/:id/room";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (refresh !== undefined) {
      params.refresh = refresh;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Fetches belongsTo relation account.
   *
   * @param any id PersistedModel id
   *
   * @param boolean refresh 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public __get__account(id: any, refresh: boolean = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id/account";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (refresh !== undefined) {
      params.refresh = refresh;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __get__accountIO(id: any, refresh: boolean = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages/:id/account";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (refresh !== undefined) {
      params.refresh = refresh;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public create(data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public createIO(data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public createMany(data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public createManyIO(data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Update an existing model instance or insert a new one into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public upsert(data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public upsertIO(data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Check whether a model instance exists in the data source.
   *
   * @param any id Model id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `exists` – `{boolean}` - 
   */
  public exists(id: any) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id/exists";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public existsIO(id: any) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages/:id/exists";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find a model instance by id from the data source.
   *
   * @param any id Model id
   *
   * @param object filter Filter defining fields and include
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public findById(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public findByIdIO(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find all instances of the model matched by filter from the data source.
   *
   * @param object filter Filter defining fields, where, include, order, offset, and limit
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public find(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public findIO(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find first instance of the model matched by filter from the data source.
   *
   * @param object filter Filter defining fields, where, include, order, offset, and limit
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public findOne(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/findOne";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public findOneIO(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages/findOne";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update instances of the model matched by where from the data source.
   *
   * @param object where Criteria to match model instances
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * The number of instances updated
   */
  public updateAll(where: any = undefined, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/update";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public updateAllIO(where: any = undefined, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages/update";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Delete a model instance by id from the data source.
   *
   * @param any id Model id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public deleteById(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public deleteByIdIO(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Count instances of the model matched by where from the data source.
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public count(where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/count";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public countIO(where: any = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages/count";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update attributes for a model instance and persist it into the data source.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public updateAttributes(id: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public updateAttributesIO(id: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Create a change stream.
   *
   * @param object data Request data.
   *
   *  - `options` – `{object}` - 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `changes` – `{ReadableStream}` - 
   */
  public createChangeStream(options: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/change-stream";
    let urlParams: any = {
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, options);
    return result;
  }

  public createChangeStreamIO(options: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/messages/change-stream";
    let urlParams: any = {
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, options, true);
    return result;
  }

  /**
   * Find a related item by id for messages.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for messages
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public __findById__Account__messages(id: any, fk: any) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __findById__Account__messagesIO(id: any, fk: any) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Delete a related item by id for messages.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for messages
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __destroyById__Account__messages(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __destroyById__Account__messagesIO(id: any, fk: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update a related item by id for messages.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for messages
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public __updateById__Account__messages(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __updateById__Account__messagesIO(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Queries messages of Account.
   *
   * @param any id User id
   *
   * @param object filter 
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public __get__Account__messages(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __get__Account__messagesIO(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Creates a new instance in messages of this model.
   *
   * @param any id User id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public __create__Account__messages(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __create__Account__messagesIO(id: any, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Creates a new instance in messages of this model.
   *
   * @param any id User id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public __createMany__Account__messages(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __createMany__Account__messagesIO(id: any, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Deletes all messages of this model.
   *
   * @param any id User id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __delete__Account__messages(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __delete__Account__messagesIO(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Counts messages of Account.
   *
   * @param any id User id
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public __count__Account__messages(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __count__Account__messagesIO(id: any, where: any = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Find a related item by id for messages.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for messages
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public __findById__Room__messages(id: any, fk: any) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __findById__Room__messagesIO(id: any, fk: any) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Delete a related item by id for messages.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for messages
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __destroyById__Room__messages(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __destroyById__Room__messagesIO(id: any, fk: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Update a related item by id for messages.
   *
   * @param any id PersistedModel id
   *
   * @param any fk Foreign key for messages
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public __updateById__Room__messages(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __updateById__Room__messagesIO(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Queries messages of Room.
   *
   * @param any id PersistedModel id
   *
   * @param object filter 
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public __get__Room__messages(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __get__Room__messagesIO(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Creates a new instance in messages of this model.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public __create__Room__messages(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __create__Room__messagesIO(id: any, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Creates a new instance in messages of this model.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Message` object.)
   * </em>
   */
  public __createMany__Room__messages(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  public __createMany__Room__messagesIO(id: any, data: any = undefined) {
    let method: string = "POST";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, data, true);
    return result;
  }

  /**
   * Deletes all messages of this model.
   *
   * @param any id PersistedModel id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __delete__Room__messages(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __delete__Room__messagesIO(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }

  /**
   * Counts messages of Room.
   *
   * @param any id PersistedModel id
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public __count__Room__messages(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};



    let result = this.request(method, url, urlParams, params);
    return result;
  }

  public __count__Room__messagesIO(id: any, where: any = undefined) {
    let method: string = "GET";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    let result = this.request(method, url, urlParams, params, true);
    return result;
  }


  /**
   * The name of the model represented by this $resource,
   * i.e. `Message`.
   */
  public getModelName() {
    return "Message";
  }
}



