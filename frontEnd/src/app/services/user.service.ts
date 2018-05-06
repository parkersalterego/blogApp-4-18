import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { environment } from '../../environments/environment';

import { CookieService } from 'angular2-cookie/services/cookies.service';

import { User } from '../models/User';

import {JwtHelper } from 'angular2-jwt';

import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  authToken: String;
  user: User;
  willActivate: boolean;

  constructor(
              private http: Http,
              private jwtHelper: JwtHelper,
              private cookieService: CookieService
            ) { }

  registerUser(user: User) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.api}/users/register`, user, {headers: headers})
      .map(res => res.json());
  }

  loginUser(user: User) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.api}/users/login`, user, {headers: headers})
      .map(res => res.json());
  }

  getUser(id, auth) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + auth);
    return this.http.get(`${environment.api}/users/${id}`, {headers: headers})
      .map(res => res.json());
  }

  authCheck() {
    const authToken = JSON.parse(localStorage.getItem('authToken'));
    const tokenInfo =  this.jwtHelper.decodeToken(authToken);
    console.log('Bearer ' + authToken);
    this.getUser(tokenInfo.id, authToken).subscribe(
      user => {
        if (user.refreshToken === this.cookieService.get('refToken')) {
          this.user = user;
          this.willActivate = true;
        } else {
          this.willActivate = false;
        }
      },
      err => {
        console.log(err);
        this.willActivate = false;
      });
  }

}
