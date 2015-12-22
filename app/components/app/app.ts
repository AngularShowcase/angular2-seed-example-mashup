/// <reference path="../../../tools/typings/tsd/socket.io-client/socket.io-client.d.ts" />
import {Component, ViewEncapsulation} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';

// Observable operators have to be imported explicitly -- but only once per app
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/subscribeOn';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/range';

import {Authentication} from '../../services/Authentication';
import {MessageBroker} from '../../services/MessageBroker';
import {IChatMessage} from '../../common/interfaces/ChatInterfaces';

import {Login} from '../login/Login';
import {Register} from '../register/Register';
import {HomeCmp} from '../home/home';
import {AboutCmp} from '../about/about';
import {FrontPage} from '../home/FrontPage';
import {NameList} from '../../services/name_list';
import {Mashup} from '../mashup/Mashup';
import {MousePlay} from '../mousePlay/MousePlay';
import {People} from '../celldata/People';
import {UsageEntry} from '../celldata/UsageEntry';
import {Usage} from '../celldata/Usage';
import {HistoricUsage} from '../celldata/HistoricUsage';
import {CycleEntry} from '../celldata/CycleEntry';
import {AnimalGame} from '../animals/AnimalGame';
import {AnimalAnalyze} from '../animals/AnimalAnalyze';
import {QuestionEntry} from '../quiz/QuestionEntry';
import {QuizCreation} from '../quiz/QuizCreation';
import {ProctorExam} from '../quiz/ProctorExam';
import {ReviewTest} from '../quiz/ReviewTest';
import {Weather} from '../streaming/Weather';
import {Chat} from '../streaming/Chat';

@Component({
  selector: 'app',
  viewProviders: [NameList],
  templateUrl: './components/app/app.html',
  styleUrls: ['./components/app/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path: '/', component: FrontPage, as: 'Home' },
  { path: '/login', component: Login, as: 'Login' },
  { path: '/register', component: Register, as: 'Register' },
  { path: '/about', component: AboutCmp, as: 'About' },
  { path: '/mashup', component: Mashup, as: 'Mashup' },
  { path: '/mouseplay', component: MousePlay, as: 'Mouseplay' },
  { path: '/people', component: People, as: 'People' },
  { path: '/usageentry', component: UsageEntry, as: 'Usageentry' },
  { path: '/cycleentry', component: CycleEntry, as: 'Cycleentry' },
  { path: '/usage', component: Usage, as: 'Usage' },
  { path: '/historicusage', component: HistoricUsage, as: 'HistoricUsage' },
  { path: '/animalgame', component: AnimalGame, as: 'Animalgame' },
  { path: '/animalanalyze', component: AnimalAnalyze, as: 'Animalanalyze' },
  { path: '/quiz/questionentry', component: QuestionEntry, as: 'QuestionEntry'},
  { path: '/quiz/quizcreation', component: QuizCreation, as: 'QuizCreation'},
  { path: '/quiz/proctorexam/:quizId', component: ProctorExam, as: 'ProctorExam'},
  { path: '/quiz/test/:testId/review', component: ReviewTest, as: 'ReviewTest'},
  { path: '/weather', component: Weather, as: 'Weather'},
  { path: '/chat', component: Chat, as: 'Chat'}
])
export class AppCmp {

  socket: SocketIOClient.Socket;
  lastChatMessage: IChatMessage = { username: '', time: new Date(), message: ''};

  constructor(public auth: Authentication, public router:Router, public messageBroker:MessageBroker) {
      this.messageBroker.getChatMessages()
        .subscribe((msg:IChatMessage) => this.lastChatMessage = msg);
  }

  getUser(): string {
    return this.auth.isLoggedIn() ? this.auth.user.username : '';
  }

  logout() {
      this.auth.logout();
      this.router.navigateByUrl('/login');
  }

  login() {
      this.logout();
  }

  register() {
      this.router.navigateByUrl('/register');
  }

  userInfo() {
      if (this.auth.isLoggedIn()) {
          // Destructuring assignment
          let {userId, username, firstName, lastName, emailAddress} = this.auth.user;
          var message = `
          UserId:\t\t${userId}
          Username:\t${username}
          First name:\t${firstName}
          Last name:\t${lastName}
          Email:\t\t${emailAddress}
          `;

          alert(message);
      } else {
          alert('You are not logged in.');
      }
  }
}
