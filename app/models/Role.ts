import {IRole} from '../../common/interfaces/SecurityInterfaces';

export class Role implements IRole {

    constructor(public name:string, public description:string) {
    }
}
