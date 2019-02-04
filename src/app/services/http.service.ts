import { Injectable, EventEmitter, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {tokenNotExpired} from 'angular2-jwt';

export class TokenNeedsRefreshingEvent {
    new_token : string
    resolve : (value?: string | PromiseLike<string>) => void
  }
  
  @Injectable()
  export class HttpService extends HttpClient {
  
    tokenNeedsRefreshingEmitter : EventEmitter<TokenNeedsRefreshingEvent> = new EventEmitter();
  
    constructor(
          handler:HttpHandler
        ) {
          super(handler);
          
    }
  
  
    get<T>(url: string, options?: any): Observable<any> {
     // console.log('Requesting: '+url)
  
      /*this.addAuth(options)
      console.log("Super get.")
      return super.get<T>(url, options)*/
  
      var observable = Observable.defer(()=>{
        return this.authAndGet(url, options)
      })
  
      return observable
  
    }
  
    patch<T>(url: string, body: any | null, options?: any): Observable<any> {
      //console.log('Requesting: '+ url + ' body: ' + JSON.stringify(body))
  
      var observable = Observable.defer(()=>{
        return this.authAndPatch(url, body, options)
      })
  
      return observable
  
    }
  
    post<T>(url: string, body: any | null, options?: any): Observable<any> {
      //console.log('Requesting: '+url + ' body: ' +  JSON.stringify(body))
  
      var observable = Observable.defer(()=>{
        return this.authAndPost(url, body, options)
      })
  
      return observable
  
    }
  
    private async authAndPost(url: string, body: any | null, options?: any) : Promise<any> {
      await this.addAuth(options)
      return super.post(url, body, options).toPromise()
    }
  
    private async authAndPatch(url: string, body: any | null, options?: any) : Promise<any> {
      //console.log('AuthAndPatch: '+url+" waiting for auth")
      await this.addAuth(options)
      //console.log('AuthAndPatch: '+url+" returning super patch")
      return super.patch(url, body, options).toPromise()
    }
  
  
    private async authAndGet(url: string, options?: any) : Promise<any> {
      await this.addAuth(options)
      return super.get(url, options).toPromise()
    }
  
    private async addAuth(options: any) : Promise<void> {
      if (options != null && options.withAuth) {
        if (tokenNotExpired() == false)
        {
          const new_token = <string>await this.refreshToken()
          //console.log("Done requesting token refresh.")
        }
  
        options['headers'] = this.authHeader();   
      }
    }
  
    private authHeader(): HttpHeaders {
      var authToken = localStorage.getItem('id_token')
      if (authToken == null) {
        //console.log('no auth token present')
        return null
      }
  
      //console.log('with auth token: '+authToken)
  
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'BEARER ' + authToken);
      return headers
    }
  
  
    private async handleAuthorizationFailedError(error: HttpErrorResponse) {
      if (error.status == 403) {
        const new_token = <string>await this.refreshToken()
  
      }
    }
        
    private refreshToken(): Promise<string> {
      var myEvent = new TokenNeedsRefreshingEvent()
      return new Promise(resolve => {
        myEvent.resolve = resolve
  
        //console.log("Emitting request for token refresh");
        this.tokenNeedsRefreshingEmitter.emit(myEvent);
      })
    }
  
  }