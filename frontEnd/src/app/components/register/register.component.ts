import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/observable';

import { UserService } from '../../services/user.service';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username: string;
  email: string;
  password: string;


  constructor(
              private userService: UserService,
              private router: Router,
              private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    // this.userService.getAuth().subscribe(auth => {
    //  if(auth) {
    //    this.router.navigate(['/]);
    // }
    // });
  }

  onSubmit() {
    this.userService.registerUser({username: this.username, email: this.email, password: this.password})
    .subscribe(data => {
      if (data) {
        this.flashMessage.show('Account Created Successfully', {cssClass: 'alert-success', timeout: 2000});
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    },
    err => {
      if (err.message !== undefined) {
        this.flashMessage.show('Error: ' + err.message, {cssClass: 'alert-error', timeout: 4000});
      } else {
        this.flashMessage.show('Error: Unknown Error', {cssClass: 'alert-error', timeout: 4000});
      }
    });
  }



}

