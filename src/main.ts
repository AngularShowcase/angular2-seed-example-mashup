import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {AppCmp} from './app/components/app';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Authentication} from './services/Authentication';
import {MessageBroker} from './services/MessageBroker';
import {DataService} from './services/redux/DataService';
import {CounterService} from './services/redux/Counter/CounterService';
import {TodoService} from './services/redux/Todo/TodoService';

bootstrap(AppCmp, [
  ROUTER_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: '/' }),
  HTTP_PROVIDERS,
  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  Authentication,
  MessageBroker,
  DataService,
  TodoService,
  CounterService
]);

// In order to start the Service Worker located at "./sw.js"
// uncomment this line. More about Service Workers here
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
// if ('serviceWorker' in navigator) {
//   (<any>navigator).serviceWorker.register('./sw.js').then(function(registration) {
//     console.log('ServiceWorker registration successful with scope: ',    registration.scope);
//   }).catch(function(err) {
//     console.log('ServiceWorker registration failed: ', err);
//   });
// }
