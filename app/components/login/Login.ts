import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Router} from 'angular2/router';
import {Authentication} from '../../services/Authentication';
import {HpFlyText} from '../../directives/HpFlyText';

@Component({
    selector: 'login',
    templateUrl: './components/login/login.html',
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, HpFlyText]
})
export class Login {

    constructor(public auth:Authentication, public router:Router) {
    }

    model:any = {
        username: '',
        password: '',
        flyText1: '',
        errors: ''
    };

    login() {
        console.log('Last route in login() is: ', this.auth.getLastRoute());

        if (!this.haveAllFields()) {
            this.model.errors = 'Please fill out the form.';
            return;
        }

        this.auth.login(this.model.username, this.model.password)
            .subscribe(loginResult => {
                if (!loginResult.succeeded) {
                    alert('Login failed');
                    return;
                }

                this.model.errors = '';
                this.model.flyText1 = this.auth.user.username;
            });
    }

    onAnimationComplete() {
        if (this.auth.isLoggedIn()) {
            // Navigate to the last url now that we are logged in
            var lastUrl = this.auth.getLastRoute();

            if (lastUrl) {
                var redirect = '/' + lastUrl;
                console.log(`Login is redirecting to ${redirect}`);
                this.router.navigateByUrl(redirect);
            } else {
                this.router.navigateByUrl('/');
            }
        }
    }

    haveAllFields() {
        return (this.model.username &&
                this.model.password);
    }

    buttonClass() : string {
        return this.haveAllFields() ? 'btn-info' : 'btn-danger';
    }
}
