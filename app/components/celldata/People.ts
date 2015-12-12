import {Component, NgFor} from 'angular2/angular2';
import {FORM_DIRECTIVES, NgClass} from 'angular2/angular2';
import {CellDataServices} from '../../services/CellDataServices';

@Component({
    selector: 'celldata-people',
    bindings: [CellDataServices],
    templateUrl: './components/celldata/People.html',
    directives: [FORM_DIRECTIVES, NgClass, NgFor]
})
export class People {

    model:any = {
        lastName: '',
        firstName: '',
        errors: '',
        people: []
    };

    constructor(public cellDataServices:CellDataServices) {

        this.getPeople();
    }

    getPeople() {
        this.cellDataServices.getPeople()
            .subscribe(people => {
                console.log('people', people);
                this.model.people = people;
            });
    }

    login() {

        if (!this.haveAllFields()) {
            this.model.errors = 'Please fill out the form.';
            return;
        }

        this.model.errors = '';

    }

    haveAllFields() {
        return (this.model.firstName &&
                this.model.lastName);
    }

    fieldsValid() {
        return this.haveAllFields();
    }

    buttonClass() : string {
        return this.fieldsValid() ? 'btn-info' : 'btn-danger';
    }

    submit() {
        this.cellDataServices.savePerson(
            { personId: 0,
              firstName: this.model.firstName,
              lastName: this.model.lastName})

              .subscribe(res => {
                    console.log(res);
                    this.getPeople();
                    });
    }
}
