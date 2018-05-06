import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CookieService } from 'angular2-cookie/services/cookies.service';

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
              private router: Router
  ) { }

  ngOnInit() {
    // this.userService.getAuth().subscribe(auth => {
    //  if(auth) {
    //    this.router.navigate(['/]);
    // }
    // });
  }

  onSubmit() {
    this.userService.loginUser({email: this.email, password: this.password})
      .subscribe(data => {
        if (data) {
          console.log(data);
          this.cookieService.put('refToken', data.refreshToken);
          localStorage.setItem('authToken', JSON.stringify(data.accessToken));
          this.flashMessage.show('Success: Logged In', {cssClass: 'alert-success', timeout: 2000});
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
