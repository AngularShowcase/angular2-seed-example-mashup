import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {ObjectDisplay} from '../objectDisplay/ObjectDisplay';
import {IGithubUser} from '../../services/ServiceInterfaces';
import {GithubServices} from '../../services/GithubServices';
import {GithubUser} from '../../models/GithubUser';
import {Http} from 'angular2/http';
import {Subject} from 'rxjs/Subject';
// import 'rxjs/add/operators/map';
// import 'rxjs/add/observable/interval';
// import 'rxjs/add/operators/where';

@Component({
    selector: 'mashup',
    bindings: [GithubServices],
    templateUrl: './components/mashup/Mashup.html',
    directives: [CORE_DIRECTIVES, ObjectDisplay, FORM_DIRECTIVES]
})
export class Mashup {

    http:Http;
    userInfo: IGithubUser;
    nameUpdate: Subject<any>;
    userDisplayData: any;
    reposDisplayData: any;
    minNameLength: number = 8;
    currentNameLength: number = 0;

    constructor(http:Http, public githubServices:GithubServices) {
        this.http = http;
        this.userInfo = new GithubUser();
        this.userDisplayData = {
            name: 'Howard',
            sports: ['lacrosse', 'bowling',
                { name: 'football',
                  rank: 1,
                  players: [
                        'Randy',
                        { FirstName: 'Howard',
                          LastName: 'Pinsley',
                          Skills: ['Quarterback', 'WideReceiver', { Position: 'Running Back', Level: 'Expert'}]
                        },
                        'David'
                    ]
                  },
                'Tetherball'
            ]
        };
        this.reposDisplayData = {};
        this.setNameLookup();
    }

    setNameLookup() {
        this.nameUpdate = new Subject();

        this.nameUpdate.subscribe(name => this.currentNameLength = name ? name.length : 0);

        var lookupNamePub = this.nameUpdate
            .filter(name => name.length >= this.minNameLength);

        var namePub = lookupNamePub
            .mergeMap(name => this.githubServices.getUser(name).toPromise());

        lookupNamePub.subscribe(name => console.log(`Lookup name observable returned name [${name}]`));

        namePub.subscribe(this.setUser.bind(this),
            error => console.log('Error', error));


        var repoPub = namePub.mergeMap((user:IGithubUser) => this.githubServices.lookupRepo(user).toPromise());

        repoPub.subscribe(this.setRepos.bind(this),
            error => console.log('repos error', error));
    }

    objectSelected(objDisplay: ObjectDisplay) {
        //console.log('mashup got: ', objDisplay);
        if (objDisplay.getType() === 'string' && /https?:/.test(objDisplay.displayObject)) {
            var url: string = objDisplay.displayObject;
            console.log('Following url: ', url);

            this.http.get(url)
                .map(response => response.json())
                .subscribe(data => objDisplay.displayObject = { url: url, data: data },
                    error => console.log('Error', error));
        }
    }

    setUser(user: IGithubUser) {
        console.log('Got a user', user);
        this.userInfo = user;
        this.userDisplayData = user;
    }

    setRepos(repos) {
        console.log('Repos', repos);
        this.reposDisplayData = repos;
    }

    onKeyUp(name) {
        this.nameUpdate.next(name.value);
    }
}
