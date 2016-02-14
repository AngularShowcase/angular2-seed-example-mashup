import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {ObjectDisplay} from '../../objectDisplay/components/ObjectDisplay';
import {IGithubUser} from '../../services/ServiceInterfaces';
import {GithubServices} from '../../services/GithubServices';
import {GithubUser} from '../../models/GithubUser';
import {Http} from 'angular2/http';
import {Subject} from 'rxjs/Subject';
import {DataService} from '../../services/redux/DataService';

@Component({
    selector: 'mashup',
    providers: [GithubServices],
    templateUrl: './components/mashup/Mashup.html',
    directives: [CORE_DIRECTIVES, ObjectDisplay, FORM_DIRECTIVES]
})
export class Mashup {

    userInfo: IGithubUser;
    nameUpdate: Subject<any>;
    userDisplayData: any;
    reposDisplayData: any;
    minNameLength: number = 8;
    currentNameLength: number = 0;

    constructor(public http:Http,
                public dataService:DataService,
                public githubServices:GithubServices) {
    }

    ngOnInit() {
        this.userInfo = new GithubUser();
        this.userDisplayData = {
            name: 'Howard',
            address: {
                city: 'Plainview',
                state: 'New York'
            },
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
            .mergeMap(name => this.githubServices.getUser(name));

        lookupNamePub.subscribe(name => console.log(`Lookup name observable returned name [${name}]`));

        namePub.subscribe(this.setUser.bind(this),
            error => console.log('Error', error));


        var repoPub = namePub.mergeMap((user:IGithubUser) => this.githubServices.lookupRepo(user));

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
