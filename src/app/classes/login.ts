import {AuthService} from '../services/auth.service';
import {OnInit, Inject, Injector } from  '@angular/core';

export class Login implements OnInit {
    username: string = "nskonst"
    password: string = "nevada"

    private authService: AuthService;

    constructor(private injector: Injector){
        this.authService = injector.get(AuthService);
    }

    ngOnInit(){
     this.onLoginSubmit();
    }

    onLoginSubmit(){
        const user = {
            username: this.username,
            password: this.password
        }
        this.authService.authenticateUser(user);
    }

}

