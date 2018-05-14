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
  canNavigate: boolean;
  authToken: String;
  user: User;




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

  }

  getUser(token) {
    const id = this.jwtHelper.decodeToken(token).id;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token.split('"')[1]);
    return this.http.get(`${environment.api}/users/${id}`, {headers: headers})
      .map(res => res.json());
  }

  authCheck() {
    const authToken = localStorage.getItem('authToken');
    const refToken = this.cookieService.get('refToken');
    // check for both auth and refresh token
    if (authToken && refToken) {
      this.getUser(authToken)
        .subscribe(user => {
          // check that refresh token is valid
          if (user.refreshToken === refToken) {
            // check that tokens are not expired
            if (this.tokenExpCheck(authToken)) {
              this.canNavigate = true;
            } else {
              // session expired
              this.router.navigate(['/login']);
              this.canNavigate = false;
            }
          } else {
            // @TODO -- blacklist refToken
            this.router.navigate(['/login']);
            this.canNavigate = false;
          }
        },
        err => {
          console.log(err);
          this.router.navigate(['/login']);
          this.canNavigate = false;
        });
    } else {
      this.router.navigate(['/login']);
      this.canNavigate = false;
    }
  }

  tokenExpCheck(token) {
    return (new Date(this.jwtHelper.getTokenExpirationDate(token)).getTime() - Date.now()) ? true : false;
  }
}


