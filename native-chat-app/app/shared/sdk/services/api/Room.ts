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
 * Api for the `Room` model.
 */
@Injectable()
export class RoomApi extends BaseLoopBackApi {

  constructor(
    @Inject(Http) http: Http,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth, 
    @Inject(JSONSearchParams) protected searchParams: JSONSearchParams, 
    @Optional() @Inject(ErrorHandler) errorHandler: ErrorHandler
  ) {
    super(http, auth, searchParams, errorHandler);
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
  public findByIdAccounts(id: any, fk: any) {
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
  public destroyByIdAccounts(id: any, fk: any) {
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
  public onDestroyByIdAccounts(id: any) {
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
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public updateByIdAccounts(id: any, fk: any, data: any = undefined) {
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
  public onUpdateByIdAccounts(id: any,  data: any = undefined) {
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
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public linkAccounts(id: any, fk: any, data: any = undefined) {
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
  public onLinkAccounts(id: any,  data: any = undefined) {
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
  public unlinkAccounts(id: any, fk: any) {
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
  public onUnlinkAccounts(id: any) {
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
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public existsAccounts(id: any, fk: any) {
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
  public findByIdMessages(id: any, fk: any) {
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
  public destroyByIdMessages(id: any, fk: any) {
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
  public onDestroyByIdMessages(id: any) {
    let method: string = "DELETE";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
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
  public updateByIdMessages(id: any, fk: any, data: any = undefined) {
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
  public onUpdateByIdMessages(id: any,  data: any = undefined) {
    let method: string = "PUT";
    let url: string = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
    let urlParams: any = {
      id: id
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
  public getAccounts(id: any, filter: LoopBackFilterInterface = undefined) {
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
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public createAccounts(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }
  public onCreateAccounts(id: any,  data: any = undefined) {
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
  public deleteAccounts(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }
  public onDeleteAccounts(id: any) {
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
  public countAccounts(id: any, where: any = undefined) {
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
  public getMessages(id: any, filter: LoopBackFilterInterface = undefined) {
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
  public createMessages(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }
  public onCreateMessages(id: any,  data: any = undefined) {
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
  public deleteMessages(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }
  public onDeleteMessages(id: any) {
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
  public countMessages(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/count";
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
  public onCreate(data: any = undefined) {
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
  public onUpsert(data: any = undefined) {
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
  public onUpdateAll(where: any = undefined,  data: any = undefined) {
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
  public onDeleteById(id: any) {
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
  public onUpdateAttributes(id: any,  data: any = undefined) {
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
  public onCreateChangeStream(options: any = undefined) {
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
  public findByIdAccountRooms(id: any, fk: any) {
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
  public destroyByIdAccountRooms(id: any, fk: any) {
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
  public onDestroyByIdAccountRooms(id: any) {
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
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public updateByIdAccountRooms(id: any, fk: any, data: any = undefined) {
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
  public onUpdateByIdAccountRooms(id: any,  data: any = undefined) {
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
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public linkAccountRooms(id: any, fk: any, data: any = undefined) {
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
  public onLinkAccountRooms(id: any,  data: any = undefined) {
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
  public unlinkAccountRooms(id: any, fk: any) {
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
  public onUnlinkAccountRooms(id: any) {
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
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public existsAccountRooms(id: any, fk: any) {
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
  public getAccountRooms(id: any, filter: LoopBackFilterInterface = undefined) {
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
   * This usually means the response is a `Room` object.)
   * </em>
   */
  public createAccountRooms(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }
  public onCreateAccountRooms(id: any,  data: any = undefined) {
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
  public deleteAccountRooms(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }
  public onDeleteAccountRooms(id: any) {
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
  public countAccountRooms(id: any, where: any = undefined) {
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
  public getMessageRoom(id: any, refresh: boolean = undefined) {
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


  /**
   * The name of the model represented by this $resource,
   * i.e. `Room`.
   */
  public getModelName() {
    return "Room";
  }
}

