import {IGithubUser} from '../services/ServiceInterfaces';

export class GithubUser implements IGithubUser {

    login: string = '';
    id: number = 0;
    avatar_url: string = '';
    gravatar_id: string = '';
    url: string = '';
    repos_url: string = '';
    message: string = '';
}
