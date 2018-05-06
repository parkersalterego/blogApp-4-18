import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { CookieService } from 'angular2-cookie/services/cookies.service';

import { User } from '../models/User';

import {JwtHelper } from 'angular2-jwt';

import { Observable } from 'rxjs/observable';

import 'rxjs/add/operator/map';


@Injectable()
export class UserService {
  authToken: String;
  user: User;
  willActivate: boolean;

  constructor(
              private http: Http,
              private router: Router,
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

  logoutUser() {
    this.user = undefined;
    localStorage.clear();
    this.willActivate = false;

  }

  getUser(id, token) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token.split('"')[1]);
    return this.http.get(`${environment.api}/users/${id}`, {headers: headers})
      .map(res => res.json());
  }

  authCheck() {
    const authToken = localStorage.getItem('authToken');
    const refToken = this.cookieService.get('refToken');
    if (authToken && refToken) {
      const tokenInfo = this.jwtHelper.decodeToken(authToken);
      const headers = new Headers();
      this.getUser(tokenInfo.id, authToken)
        .subscribe(user => {
          if (user.refreshToken === refToken) {
            this.user = user;
            this.willActivate = true;
            if (this.router.url === '/login') {
              this.router.navigate(['/']);
              return true;
            } else {
              return true;
            }
          } else {
            // @TODO blacklist refToken
            return false;
          }
        },
        err => {
          console.log(err);
          return false;
        });
    } else {
      return false;
    }
  }

  tokenExpCheck(token) {
    return (new Date(this.jwtHelper.getTokenExpirationDate(token)).getTime() - Date.now()) ? true : false;
  }
}
