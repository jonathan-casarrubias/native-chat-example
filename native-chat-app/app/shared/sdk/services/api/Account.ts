/* tslint:disable */
import { Injectable, Inject, Optional } from '@angular/core';
import { Http } from '@angular/http';
import { BaseLoopBackApi } from '../baseApi.service';
import { LoopBackConfig } from '../config.service';
import { LoopBackAuth } from '../auth.service';
import { ErrorHandler } from '../errorHandler.service';
import { JSONSearchParams } from '../search.params';
import { LoopBackFilterInterface } from '../api.d';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

/**
 * Api for the `Account` model.
 */
@Injectable()
export class AccountApi extends BaseLoopBackApi {

  constructor(
    @Inject(Http) http: Http,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth, 
    @Inject(JSONSearchParams) protected searchParams: JSONSearchParams, 
    @Optional() @Inject(ErrorHandler) errorHandler: ErrorHandler
  ) {
    super(http, auth, searchParams, errorHandler);
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
  public findByIdAccessTokens(id: any, fk: any) {
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
  public destroyByIdAccessTokens(id: any, fk: any) {
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
  public onDestroyByIdAccessTokens(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id
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
  public updateByIdAccessTokens(id: any, fk: any, data: any = undefined) {
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
  public onUpdateByIdAccessTokens(id: any,  data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id
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
  public findByIdRooms(id: any, fk: any) {
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
  public destroyByIdRooms(id: any, fk: any) {
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
  public onDestroyByIdRooms(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
    let urlParams: any = {
      id: id
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
  public updateByIdRooms(id: any, fk: any, data: any = undefined) {
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
  public onUpdateByIdRooms(id: any,  data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
    let urlParams: any = {
      id: id
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
  public linkRooms(id: any, fk: any, data: any = undefined) {
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
  public onLinkRooms(id: any,  data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
    let urlParams: any = {
      id: id
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
  public unlinkRooms(id: any, fk: any) {
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
  public onUnlinkRooms(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
    let urlParams: any = {
      id: id
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
  public existsRooms(id: any, fk: any) {
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
  public findByIdMessages(id: any, fk: any) {
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
  public destroyByIdMessages(id: any, fk: any) {
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
  public onDestroyByIdMessages(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
    let urlParams: any = {
      id: id
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
  public updateByIdMessages(id: any, fk: any, data: any = undefined) {
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
  public onUpdateByIdMessages(id: any,  data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
    let urlParams: any = {
      id: id
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
  public getAccessTokens(id: any, filter: LoopBackFilterInterface = undefined) {
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
  public createAccessTokens(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }
  public onCreateAccessTokens(id: any,  data: any = undefined) {
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
  public deleteAccessTokens(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }
  public onDeleteAccessTokens(id: any) {
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
  public countAccessTokens(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
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
  public getRooms(id: any, filter: LoopBackFilterInterface = undefined) {
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
  public createRooms(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }
  public onCreateRooms(id: any,  data: any = undefined) {
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
  public deleteRooms(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }
  public onDeleteRooms(id: any) {
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
  public countRooms(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
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
  public getMessages(id: any, filter: LoopBackFilterInterface = undefined) {
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
  public createMessages(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }
  public onCreateMessages(id: any,  data: any = undefined) {
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
  public deleteMessages(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }
  public onDeleteMessages(id: any) {
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
  public countMessages(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
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
  public onCreate(data: any = undefined) {
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
  public onUpsert(data: any = undefined) {
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
  public onUpdateAll(where: any = undefined,  data: any = undefined) {
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
  public onDeleteById(id: any) {
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
  public onUpdateAttributes(id: any,  data: any = undefined) {
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
  public onCreateChangeStream(options: any = undefined) {
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

    let result = this.request(method, url, urlParams, params, credentials)
      .share();
      result.subscribe(
        (response: { id: string, userId: string, user: any }) => {
          this.auth.setUser(response.id, response.userId, response.user);
          this.auth.setRememberMe(true);
          this.auth.save();
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
          this.auth.clearUser();
          this.auth.clearStorage();
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
  public findByIdRoomAccounts(id: any, fk: any) {
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
  public destroyByIdRoomAccounts(id: any, fk: any) {
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
  public onDestroyByIdRoomAccounts(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
    let urlParams: any = {
      id: id
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
  public updateByIdRoomAccounts(id: any, fk: any, data: any = undefined) {
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
  public onUpdateByIdRoomAccounts(id: any,  data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
    let urlParams: any = {
      id: id
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
  public linkRoomAccounts(id: any, fk: any, data: any = undefined) {
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
  public onLinkRoomAccounts(id: any,  data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
    let urlParams: any = {
      id: id
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
  public unlinkRoomAccounts(id: any, fk: any) {
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
  public onUnlinkRoomAccounts(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
    let urlParams: any = {
      id: id
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
  public existsRoomAccounts(id: any, fk: any) {
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
  public getRoomAccounts(id: any, filter: LoopBackFilterInterface = undefined) {
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
  public createRoomAccounts(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }
  public onCreateRoomAccounts(id: any,  data: any = undefined) {
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
  public deleteRoomAccounts(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }
  public onDeleteRoomAccounts(id: any) {
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
  public countRoomAccounts(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
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
  public getMessageAccount(id: any, refresh: boolean = undefined) {
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

  /**
   * @ngdoc method
   * @name sdk.Account#getCurrent
   * @methodOf sdk.Account
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
    let id: any = this.auth.getCurrentUserId();
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
        this.auth.setCurrentUserData(response);
        return response.resource;
      },
      () => null
    );
    return result;
  }

  /**
   * Get data of the currently logged user that was returned by the last
   * call to {@link sdk.Account#login} or
   * {@link sdk.Account#getCurrent}. Return null when there
   * is no user logged in or the data of the current user were not fetched
   * yet.
   *
   * @returns object A Account instance.
   */
  public getCachedCurrent() {
    return this.auth.getCurrentUserData();
  }

  /**
   * @name sdk.Account#isAuthenticated
   *
   * @returns {boolean} True if the current user is authenticated (logged in).
   */
  public isAuthenticated() {
    return this.getCurrentId() != null;
  }

  /**
   * @name sdk.Account#getCurrentId
   *
   * @returns object Id of the currently logged-in user or null.
   */
  public getCurrentId() {
    return this.auth.getCurrentUserId();
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `Account`.
   */
  public getModelName() {
    return "Account";
  }
}

