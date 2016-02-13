import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {Router} from 'angular2/router';
import {Authentication} from '../../services/Authentication';

@Component({
    selector: 'login',
    templateUrl: './components/login/login-material.html',
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, MATERIAL_DIRECTIVES]
})
export class Login {

    username:string;
    password:string;

    constructor(public auth:Authentication, public router:Router) {
    }

    register() {
        this.router.navigateByUrl('/register');
    }

    ngOnInit() {
        console.log('Login form initialized');
    }

    ngOnDestroy() {
        console.log('Login form destroyed');
    }
    login() {
        console.log('Last route in login() is: ', this.auth.getLastRoute());

        this.auth.login(this.username, this.password)
            .subscribe(loginResult => {
                if (!loginResult.succeeded) {
                    alert('Login failed');
                    return;
                }

                // Navigate to the last url now that we are logged in
                var lastUrl = this.auth.getLastRoute();

                if (lastUrl) {
                    var redirect = '/' + lastUrl;
                    console.log(`Login is redirecting to ${redirect}`);
                    this.router.navigateByUrl(redirect);
                } else {
                    this.router.navigateByUrl('/');
                }
            });
    }
}
