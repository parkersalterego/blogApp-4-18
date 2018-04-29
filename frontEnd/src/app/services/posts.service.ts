import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
@Injectable()
export class PostsService {
  constructor(private http: Http) { }

  getPosts() {
    return this.http.get(`http://localhost:8080/api/posts`)
      .map(res => res.json);
  }

}
