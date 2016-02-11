import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Authentication} from './services/Authentication';
import {AppCmp} from './components/app/app';
import {MessageBroker} from './services/MessageBroker';
import {DataService} from './services/redux/DataService';
import {CounterService} from './services/redux/Counter/CounterService';
import {TodoService} from './services/redux/Todo/TodoService';

bootstrap(AppCmp, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  Authentication,
  MessageBroker,
  DataService,
  TodoService,
  CounterService
]);
