import {Component, NgFor, NgModel} from 'angular2/angular2';
import {FORM_DIRECTIVES} from 'angular2/angular2';
import {MessageBroker} from '../../services/MessageBroker';
import {Authentication} from '../../services/Authentication';
import {IRegisteredUser} from '../../common/interfaces/RegistrationInterfaces';
//import {IChatMessage} from '../../common/interfaces/ChatInterfaces';

@Component({
    selector: 'chat',
    templateUrl: './components/streaming/Chat.html',
    styleUrls: ['./components/streaming/Chat.css'],
    pipes: [],
    directives: [FORM_DIRECTIVES, NgFor, NgModel]
})
export class Chat {

    user: IRegisteredUser;
    message: string = '';

    constructor(public messaageBroker:MessageBroker, public authentication:Authentication) {
        // if (!this.authentication.authenticate()) {
        //     return;
        // }

        this.user = this.authentication.user;
    }

    sendMessage(msg:string) {
        this.messaageBroker.sendChatMessage({
            username: 'need to login',
            time: new Date(),
            message: msg
        });

        this.message = '';
    }
}
