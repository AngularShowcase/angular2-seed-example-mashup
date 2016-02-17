import {Component, ViewEncapsulation} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Observable} from 'rxjs/Observable';

// Observable operators have to be imported explicitly -- but only once per app
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/subscribeOn';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/range';

import {DataService} from '../../services/redux/DataService';
import {Authentication} from '../../services/Authentication';
import {MessageBroker} from '../../services/MessageBroker';
import {IChatMessage} from '../../../common/interfaces/ChatInterfaces';
import {PersistenceService} from '../../services/redux/Persistence/PersistenceService';

import {AboutCmp} from '../../about/components/about';
import {NameList} from '../../shared/services/name_list';

import {Login} from '../../login/Components/Login';
import {Register} from '../../register/components/Register';
import {FrontPage} from '../../home/components/FrontPage';
import {Mashup} from '../../mashup/components/Mashup';
import {MousePlay} from '../../mousePlay/components/MousePlay';
import {People} from '../../celldata/components/People';
import {UsageEntry} from '../../celldata/components/UsageEntry';
import {Usage} from '../../celldata/components/Usage';
import {HistoricUsage} from '../../celldata/components/HistoricUsage';
import {CycleEntry} from '../../celldata/components/CycleEntry';
import {AnimalGame} from '../../animals/components/AnimalGame';
import {AnimalAnalyze} from '../../animals/components/AnimalAnalyze';
import {QuestionEntry} from '../../quiz/components/QuestionEntry';
import {QuizCreation} from '../../quiz/components/QuizCreation';
import {ProctorExam} from '../../quiz/components/ProctorExam';
import {ReviewTest} from '../../quiz/components/ReviewTest';
import {UserReview} from '../../quiz/components/UserReview';
import {Weather} from '../../streaming/components/Weather';
import {Chat} from '../../streaming/components/Chat';
import {QuizAdmin} from '../../quiz/components/QuizAdmin';
import {Admin} from '../../admin/components/Admin';
import {Todo} from '../../redux/components/Todo';
import {Counter} from '../../redux/components/Counter';
import {StateDisplay} from '../../redux/components/StateDisplay/StateDisplay';

@Component({
  selector: 'app',
  viewProviders: [NameList, PersistenceService],
  templateUrl: './app/components/app.html',
  styleUrls: ['./app/components/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, StateDisplay]
})
@RouteConfig([
  { path: '/', component: FrontPage, name: 'Home' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/register', component: Register, name: 'Register' },
  { path: '/admin/...', component: Admin, name: 'Admin' },
  { path: '/about', component: AboutCmp, name: 'About' },
  { path: '/mashup', component: Mashup, name: 'Mashup' },
  { path: '/mouseplay', component: MousePlay, name: 'Mouseplay' },
  { path: '/people', component: People, name: 'People' },
  { path: '/usageentry', component: UsageEntry, name: 'Usageentry' },
  { path: '/cycleentry', component: CycleEntry, name: 'Cycleentry' },
  { path: '/usage', component: Usage, name: 'Usage' },
  { path: '/historicusage', component: HistoricUsage, name: 'HistoricUsage' },
  { path: '/animalgame', component: AnimalGame, name: 'Animalgame' },
  { path: '/animalanalyze', component: AnimalAnalyze, name: 'Animalanalyze' },
  { path: '/quiz/questionentry', component: QuestionEntry, name: 'QuestionEntry'},
  { path: '/quiz/admin', component: QuizAdmin, name: 'QuizAdmin'},
  { path: '/quiz/quizcreation', component: QuizCreation, name: 'QuizCreation'},
  { path: '/quiz/proctorexam/:testId', component: ProctorExam, name: 'ProctorExam'},
  { path: '/quiz/test/:testId/review/...', component: ReviewTest, name: 'ReviewTest'},
  { path: '/quiz/user/review/...', component: UserReview, name: 'UserReview'},
  { path: '/weather', component: Weather, name: 'Weather'},
  { path: '/chat', component: Chat, name: 'Chat'},
  { path: '/redux/statedisplay', component: StateDisplay, name: 'StateDisplay'},
  { path: '/redux/counter', component: Counter, name: 'Counter'},
  { path: '/redux/todo', component: Todo, name: 'Todo'}
])
export class AppCmp {

  socket: SocketIOClient.Socket;
  lastChatMessage: IChatMessage = { username: '', time: new Date(), message: ''};
  persistenceState: Observable<any>;
  showLeftPanel:boolean = false;

  leftPanel = {
      on: {
          leftPanel: {
            'float' : 'left',
            'max-width' : '300px',
            'max-height' : '600px',
            'overflow-x' : 'scroll',
            'overflow-y' : 'scroll',
            'margin-right' : '10px',
            'border-right' : '1px solid black',
            'border-bottom' : '1px solid black'
          },
          mainContent : {
            'float' : 'left'
          }
      },

      off: {
          leftPanel: {
            'display' : 'none'
          },
          mainContent : {
            'clear' : 'both'
          }
      }
  };

  constructor(public dataService:DataService,
              public persistenceService:PersistenceService,
              public auth: Authentication,
              public router:Router,
              public messageBroker:MessageBroker) {

      this.messageBroker.getChatMessages()
        .subscribe((msg:IChatMessage) => this.lastChatMessage = msg);

      this.persistenceState = this.persistenceService.persistenceStateChanged;
      this.scheduleAutoSave();
  }

  getUser(): string {
    return this.auth.isLoggedIn() ? this.auth.user.username : '';
  }

  isLoggedIn():boolean {
      return this.auth.isLoggedIn();
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

  toggleLeftPanel() {
      this.showLeftPanel = !this.showLeftPanel;
  }

//   leftPanelDisplayValue() :string {
//       return this.showLeftPanel ? 'block' : 'none';
//   }

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

  scheduleAutoSave() {
      const sleepTime = 10000;
      setInterval(() => this.saveState(), sleepTime);
  }

  saveState() {
      console.log('Saving state to local storage');
      this.dataService.saveState();
      this.persistenceService.savedState(new Date());
  }

  leftPanelStyle() {
      return this.showLeftPanel ? this.leftPanel.on.leftPanel : this.leftPanel.off.leftPanel;
  }

  mainContentStyle() {
      return this.showLeftPanel ? this.leftPanel.on.mainContent : this.leftPanel.off.mainContent;
  }
}
