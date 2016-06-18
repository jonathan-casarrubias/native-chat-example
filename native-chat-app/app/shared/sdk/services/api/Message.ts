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
 * Api for the `Message` model.
 */
@Injectable()
export class MessageApi extends BaseLoopBackApi {

  constructor(
    @Inject(Http) http: Http,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth, 
    @Inject(JSONSearchParams) protected searchParams: JSONSearchParams, 
    @Optional() @Inject(ErrorHandler) errorHandler: ErrorHandler
  ) {
    super(http, auth, searchParams, errorHandler);
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
  public getRoom(id: any, refresh: boolean = undefined) {
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
  public onGetRoom(id: any, refresh: boolean = undefined) {
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
  public getAccount(id: any, refresh: boolean = undefined) {
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
  public onGetAccount(id: any, refresh: boolean = undefined) {
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
  public onCreate(data: any = undefined) {
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
  public onCreateMany(data: any = undefined) {
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
  public onUpsert(data: any = undefined) {
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
  public onExists(id: any) {
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
  public onFindById(id: any, filter: LoopBackFilterInterface = undefined) {
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
  public onFind(filter: LoopBackFilterInterface = undefined) {
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
  public onFindOne(filter: LoopBackFilterInterface = undefined) {
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
  public onUpdateAll(where: any = undefined, data: any = undefined) {
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
  public onDeleteById(id: any) {
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
  public onCount(where: any = undefined) {
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
  public onUpdateAttributes(id: any, data: any = undefined) {
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
  public onCreateChangeStream(options: any = undefined) {
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
  public findByIdAccountMessages(id: any, fk: any) {
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
  public onFindByIdAccountMessages(id: any, fk: any) {
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
  public destroyByIdAccountMessages(id: any, fk: any) {
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
  public onDestroyByIdAccountMessages(id: any, fk: any) {
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
  public updateByIdAccountMessages(id: any, fk: any, data: any = undefined) {
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
  public onUpdateByIdAccountMessages(id: any, fk: any, data: any = undefined) {
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
  public getAccountMessages(id: any, filter: LoopBackFilterInterface = undefined) {
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
  public onGetAccountMessages(id: any, filter: LoopBackFilterInterface = undefined) {
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
  public createAccountMessages(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }
  public onCreateAccountMessages(id: any, data: any = undefined) {
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
  public createManyAccountMessages(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }
  public onCreateManyAccountMessages(id: any, data: any = undefined) {
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
  public deleteAccountMessages(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }
  public onDeleteAccountMessages(id: any) {
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
  public countAccountMessages(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }
  public onCountAccountMessages(id: any, where: any = undefined) {
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
  public findByIdRoomMessages(id: any, fk: any) {
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
  public onFindByIdRoomMessages(id: any, fk: any) {
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
  public destroyByIdRoomMessages(id: any, fk: any) {
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
  public onDestroyByIdRoomMessages(id: any, fk: any) {
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
  public updateByIdRoomMessages(id: any, fk: any, data: any = undefined) {
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
  public onUpdateByIdRoomMessages(id: any, fk: any, data: any = undefined) {
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
  public getRoomMessages(id: any, filter: LoopBackFilterInterface = undefined) {
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
  public onGetRoomMessages(id: any, filter: LoopBackFilterInterface = undefined) {
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
  public createRoomMessages(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }
  public onCreateRoomMessages(id: any, data: any = undefined) {
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
  public createManyRoomMessages(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }
  public onCreateManyRoomMessages(id: any, data: any = undefined) {
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
  public deleteRoomMessages(id: any) {
    let method: string = "DELETE";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }
  public onDeleteRoomMessages(id: any) {
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
  public countRoomMessages(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }
  public onCountRoomMessages(id: any, where: any = undefined) {
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

