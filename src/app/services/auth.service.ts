import { Injectable, EventEmitter  } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import {HttpService, TokenNeedsRefreshingEvent} from '../services/http.service';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = 'http://' + environment.API_IP + ":" + environment.PORT_AUTH + environment.ENDPOINT_AUTH
//const LOGIN_URL = API_URL + '/testauth/';
const LOGIN_URL = API_URL + '/egonline/';

export class LoggedInEvent {
	loggedIn : boolean
	data : any

	constructor(data : JSON, loggedIn : boolean) {
		this.data = data
		this.loggedIn = loggedIn
	}
}

@Injectable()
export class AuthService {
	authToken : string;
	refreshToken : string;
	user : any;
	busyRefreshingToken : boolean;

	loggedInEmitter : EventEmitter<LoggedInEvent> = new EventEmitter();
	refreshedEmitter : EventEmitter<LoggedInEvent> = new EventEmitter();
	private tokenNeedsRefreshingSubscription;

	constructor(private http:HttpService, private httpClient:HttpClient) {
		this.tokenNeedsRefreshingSubscription = http.tokenNeedsRefreshingEmitter.subscribe({
			next: (event: TokenNeedsRefreshingEvent) => {
				//console.log("Received request for token refresh")
				this.handleTokenNeedsRefreshingEvent(event)
			}
		})
	}


	authenticateUser(user) {

		//working authentication to Euroglot Online API	
		const formData = new FormData();

		formData.append('username', user.username);
		formData.append('password', user.password);

		this.http.post<JSON>(LOGIN_URL, formData).subscribe(
			data => this.handleLoginSuccess(data),
			error => this.handleLoginError(error),
			() => null
		)
	}


	private handleLoginSuccess(data) {
		//console.log("DATA" + JSON.stringify(data));
		var loggedIn : boolean = false;
		if(data.token) {
			this.storeUserData(data.token, data.refresh_token, data.user);
			loggedIn = true;
		}
		var myEvent = new LoggedInEvent(data, loggedIn)
		this.loggedInEmitter.emit(myEvent);
	}

	private handleLoginError(error) {
		console.log(error);
		var myEvent = new LoggedInEvent(error, false)
		this.loggedInEmitter.emit(myEvent);
	}



	private storeUserData(token : string, refresh_token : string, user : any){
		localStorage.setItem('id_token', token);
		localStorage.setItem('refresh_token', refresh_token);
		localStorage.setItem('user', JSON.stringify(user));
		this.authToken = token;
		this.refreshToken = refresh_token;
		this.user = user;
	}

	private loadToken(){
		this.authToken = localStorage.getItem('id_token');
	}

	private loadRefreshToken(){
		this.refreshToken = localStorage.getItem('refresh_token');
	}

	checkLogin() : boolean {
		if (typeof this.authToken === 'undefined' || this.authToken === null || this.authToken == 'undefined') {
			//console.log('TOKEN loading.')
			this.loadToken()
			this.loadRefreshToken()
		}

		if (typeof this.authToken === 'undefined' || this.authToken === null || this.authToken == 'undefined') {
			//console.log('TOKEN doesnt exist.')
			return false
		}

		var notExpired = tokenNotExpired()

		if (notExpired) {
			//console.log('TOKEN not expired. So we are already logged in...')
			return true
		}

		//console.log('TOKEN expired. Refresh the token!')
		this.refreshTheToken()

		return false
	}


	private refreshTheToken() {
		if (this.busyRefreshingToken) {
			return
		}

		this.busyRefreshingToken = true
		
		if (typeof this.authToken === 'undefined' || this.authToken === null || this.authToken == 'undefined') {
			//console.log('TOKEN loading for refresh.')
			this.loadToken()
			this.loadRefreshToken()
		}

		let body = {
			"token" : this.authToken,
			"refresh_token" : this.refreshToken
		}
		//console.log('Request refresh with PATCH data: ' + JSON.stringify(body))
		this.httpClient.patch(API_URL+'/refresh_token/', body).subscribe(
			data => this.handleRefreshSuccess(data),
			error => this.handleRefreshError(error),
			() => {
				this.busyRefreshingToken = false
			},
		);
	}

	private refreshTheTokenPromised() : Promise<void> {

		return new Promise<void>((resolve, reject) => {
			if(tokenNotExpired() == true) {
				resolve()
				return
			}

			var refreshedSubscription = this.refreshedEmitter.subscribe({
				next: (event: LoggedInEvent) => {
					resolve()
				}
			})
			this.refreshTheToken()
		})
		
	}



	private handleTokenNeedsRefreshingEvent(event : TokenNeedsRefreshingEvent) {
		this.refreshTheTokenPromised().then(() => {
			event.new_token = this.authToken
			//console.log('Call resolve of promise')
			event.resolve(event.new_token)
		})
	}
	
	private handleRefreshSuccess(data) {
		//console.log("Refreshed data: " + JSON.stringify(data));

		var refreshed : boolean = false

		if ((data['data']) && (data.data.type == 'error')) {
			//console.log(data.data.message);
		} else {
			this.authToken = data.token
			localStorage.setItem('id_token', this.authToken);
			refreshed = true
		}

		var myEvent = new LoggedInEvent(data, refreshed)
		this.refreshedEmitter.emit(myEvent);

	}

	private handleRefreshError(error) {
		console.log(error);

		var myEvent = new LoggedInEvent(error, false)
		this.refreshedEmitter.emit(myEvent);
	}

	logout() : Promise<any> {
		if (typeof this.authToken === 'undefined' || this.authToken === null || this.authToken == 'undefined') {
			//console.log('TOKEN loading for logout.')
			this.loadToken()
			this.loadRefreshToken()
		}

		let body = {
			"token": this.authToken,
			"refresh_token": this.refreshToken
		}

		return new Promise<any>((resolve, reject) => {
			this.http.post<JSON>(API_URL+'/logout/', body).subscribe(
				data => {
					if(data.success) {
						//alert("You have been logged out");
						localStorage.clear();
						resolve()
					} else if((data.data.type == "error") && (data.data.message == "Token logout error: sql: no rows in result set")) {
						localStorage.clear();
						resolve()
					} else {
						reject("Failed to logout: " + JSON.stringify(data))
					}
				},
				error => {
					console.log(error);
					reject(error)
				},
				() => null
			);
		});
	}

	
	forgotPasswordSubmit(username: string, email: string) : Observable<JSON> {
		const formData = new FormData();

		formData.append('username', username);
		formData.append('email', email);
		formData.append('maillink', environment.RESET_PASSWORD_EGO_MAILLINK);
		
		return this.http.post<JSON>(API_URL+ environment.RESET_PASSWORD_EGO , formData);	
	}

}