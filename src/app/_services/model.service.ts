
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpParams, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subject, throwError, TimeoutError } from 'rxjs';
import { catchError, map, timeout, last } from 'rxjs/operators';
import * as _ from 'lodash';
import { AppConfigService } from '../app.config.service';

@Injectable()
export class RestService {
    timeLeft: number = 1800;
    // interval: NodeJS.Timeout;
    reserveSource = new Subject();
    constructor(private http: HttpClient, private appConfig: AppConfigService) {
        this.baseUrl = appConfig.getBaseURL();
        if (!this.baseUrl.endsWith('/')) {
            this.baseUrl = this.baseUrl + '/';
        }
    }
    baseUrl: string;
    VSessionId: string;
    csrfToken: string;

    private buildUrl(urlEndpoint: any) {
        if (urlEndpoint.startsWith('/')) {
            urlEndpoint = urlEndpoint.substring(1, urlEndpoint.length);
        }
        return this.baseUrl + urlEndpoint;
    }

    private logoutRedirect() {
        // if (!$rootScope.logoutUserInitialized) location.reload(true);
    }

    private httpRequestHandlerResponseTypeText(method: string, url: string, postBody: any, config?: any) {
      config = config || {};
      config.timeout = config.timeout || 60000; // millisecs

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      const VSessionId = config.VSessionId || this.VSessionId;
      if (VSessionId) {
        headers = headers.set('VSessionId', config.VSessionId || this.VSessionId);
      }

      if (this.csrfToken) {
        headers = headers.set('X-XSRF-TOKEN', this.csrfToken);
      }

      const params = method === 'GET' && config.params ? new HttpParams({ fromObject: config.params }) : undefined;
      return this.http
        .request(method, url, {
          headers,
          params,
          observe: 'response',
          responseType: 'text',
          body: postBody,
          reportProgress: true,
          withCredentials: true
        })
        .pipe(
          timeout(config.timeout),
          map(this.handleResponseRequestTypeText),
          catchError(error => this.handleError(error, config))
        );
    }

    private httpRequestHandler(method: string, url: string, postBody: any, config?: any) {
        config = config || {};
        let headers;
        config.timeout = config.timeout || 60000; // millisecs
        let user = JSON.parse(localStorage.getItem('FUEL_INVENTORY'));
        if (user && user.token) {
         headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':
              'https://fuel-inventory-backend.onrender.com/api/v1/',
            Authorization: 'Bearer ' + user.token,
          });
        }else{
            headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':
                  'https://fuel-inventory-backend.onrender.com/api/v1/',
               // Authorization: 'Bearer ' + user.token,
              });
        }
        

        const params = method === 'GET' && config.params ? new HttpParams({ fromObject: config.params }) : undefined;
        if(config.timeout !== 'no_timeout'){
            return this.http
            .request(method, url, {
                headers,
                params,
                observe: 'response',
                body: postBody,
                reportProgress: true,
                withCredentials: true
            })
            .pipe(
                timeout(config.timeout),
                map(this.handleResponse),
                catchError(error => this.handleError(error, config))
            );
        }
        else
        {
            return this.http
            .request(method, url, {
                headers,
                params,
                observe: 'response',
                body: postBody,
                reportProgress: true,
                withCredentials: true
            })
            .pipe(
                map(this.handleResponse),
                catchError(error => this.handleError(error, config))
            );
        }

    }

    private httpRequestHandlerOAuth(method: string, url: string, postBody: any, config?: any) {
        config = config || {};
        config.timeout = config.timeout || 60000; // millisecs

        let headers = new HttpHeaders();
        if (config?.['Content-Type'] === undefined) {
            headers = headers.set('Content-Type', 'application/json');
        } else {
            headers = headers.set('Content-Type', config['Content-Type']);
        }

        if (config?.['Authorization']) {
            this.jwt();
        }

        const params = config.params ? new HttpParams({ fromObject: config.params }) : undefined;
        return this.http
            .request(method, url, {
                headers,
                params,
                observe: 'response',
                body: postBody,
                reportProgress: true,
                withCredentials: false
            })
            .pipe(
                timeout(config.timeout),
                map(this.handleResponse),
                catchError(error => this.handleError(error, config))
            );
    }

    private handleResponse(response: HttpResponse<any>) {
        const { body, headers } = response;
        // headers.keys();
        if (headers && headers.get('content-type') === 'text/html' && body.data && body.data.search('j_security_check') > 0) {
            // Session Time out scenario.
            // TODO: Eventually use 401 instead of 200 for session timeouts.
            // $log.info('Session Timed out');
            this.logoutRedirect();
        }

        return { ...body, httpResponseHeader: headers };
    }

    private handleResponseRequestTypeText(response: HttpResponse<any>) {
        const { body, headers } = response;
        // headers.keys();
        if (headers && headers.get('content-type') === 'text/html' && body.data && body.data.search('j_security_check') > 0) {
        // Session Time out scenario.
        // TODO: Eventually use 401 instead of 200 for session timeouts.
        // $log.info('Session Timed out');
        this.logoutRedirect();
        }

        return { body, httpResponseHeader: headers };
    }

    private handleError(error: Error, config) {
        if (error instanceof TimeoutError) {
            return throwError({
                status: 499,
                error: {
                    message: 'Request timed out',
                    details: 'Client timed out waiting for request taking longer than ' + config.timeout / 1000 + ' seconds.'
                }
            });
        }

        if (error instanceof HttpErrorResponse) {
            const { headers, status } = error;
            if (status === 0) {
                // $log.info('Status is 0. url was : '+  config.url);
                this.logoutRedirect();
                return throwError({
                    status: 0,
                    error: {
                        message: 'Server Unreachable',
                        details: 'The server is currently unavailable.'
                    }
                });
            }

            if (status === 403) {
                return throwError({
                    status,
                    error: {
                        message: 'Forbidden Request',
                        details: 'User is not permitted to perform the requested operation.'
                    }
                });
            }

            return throwError({
                status,
                error: {
                    message: error.message,
                    details: error.error
                },
                headers
            });
        }

        throwError(error);
    }

    get(url, config?) {
        return this.httpRequestHandler('GET', this.buildUrl(url), {}, config);
    }

    post(url, postBody, config?) {
        return this.httpRequestHandler('POST', this.buildUrl(url), postBody, config);
    }

    postOAuth(url, postBody, config?) {
        return this.httpRequestHandlerOAuth('POST', url, postBody, config);
    }

    postResponseTypeText(url, postBody, config?) {
    return this.httpRequestHandlerResponseTypeText('POST', this.buildUrl(url), postBody, config);
    }

    getResponseTypeText(url, config?) {
      return this.httpRequestHandlerResponseTypeText('GET', this.buildUrl(url), {}, config);
    }

    put(url, postBody?, config?) {
        return this.httpRequestHandler('PUT', this.buildUrl(url), postBody, config);
    }

    delete(url, config?) {
        return this.httpRequestHandler('DELETE', this.buildUrl(url), {}, config);
    }
    private jwt() {
        // create authorization header with jwt token
        // let user = this.authService.getUser() //JSON.parse( );
        // if (user && user.token) {
        //   let headers = { 'Authorization': 'Bearer ' + user.token };
        //   return { headers } ;
        // }
        //  create authorization header with jwt token
        let user = JSON.parse(localStorage.getItem('FUEL_INVENTORY'));
        if (user && user.token) {
          // let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
          // return new RequestOptions({ headers: headers });
          let headers = { Authorization: 'Bearer ' + user.token,
                          'Content-Type' : 'application/json' };
          return { headers };
        }
      }

}


