import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(
              private userService: UserService,
              private cookieService: CookieService,
              private flashMessage: FlashMessagesService,
              private jwtHelper: JwtHelper,
              private router: Router
  ) { }

  ngOnInit() {
    this.userService.authCheck();
  }

  onSubmit() {
    this.userService.loginUser({email: this.email, password: this.password})
      .subscribe(data => {
        if (data) {
          this.cookieService.put('refToken', data.refreshToken);
          localStorage.setItem('authToken', JSON.stringify(data.accessToken));
          this.flashMessage.show('Success: Logged In', {cssClass: 'alert-success', timeout: 2000});
          this.userService.authCheck();
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        }
      },
      err => {
        if (err.message !== undefined) {
          this.flashMessage.show('Error: ' + err.message, {cssClass: 'alert-error', timeout: 4000});
        } else {
          this.flashMessage.show('Error: Unknown Error', {cssClass: 'alert-error', timeout: 4000});
        }
      }
    );
  }

}
