import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
  authToken: String;
  user: {};

  constructor(private http: Http) { }

  registerUser(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('With-Credentials', 'true');
    return this.http.post(`${environment.api}/users/register`, user, {headers: headers})
      .map(res => res.json());
  }

  loginUser(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.api}/users/login`, user, {headers: headers})
      .map(res => console.log(res.json()));
  }

}
