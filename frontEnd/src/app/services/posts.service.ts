import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

import { UserService } from '../services/user.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


@Injectable()
export class PostsService {
  constructor(
              private http: Http,
              private userService: UserService,
  ) { }

  getPosts() {
    const headers = new Headers();
    const token = JSON.parse(localStorage.getItem('authToken'));
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
    return this.http.get(`${environment.api}/posts`, {headers: headers})
      .map(res => res.json());
  }

}
