import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'angular2-cookie/services/cookies.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private userService: UserService ) {}

  canActivate() {
    return this.userService.canNavigate;
  }
}
