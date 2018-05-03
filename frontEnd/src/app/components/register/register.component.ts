import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username: String;
  email: String;
  password: String;
  message: {
    status: Number,
    text: String
  };

  constructor(
              private userService: UserService,
              private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    if (!this.userService.validateEmail(this.email)) {
      this.message = {
        status: 401,
        text: 'Error: "Please use a valid email address"'
      };
      console.error(this.message);
    }

    // else if (!this.userService.validatePassword(this.password)) {
    //   this.message = {
    //     status: 401,
    //     text: 'Error: "Password must be between 7 and 12 characters and contain one of each of the following: lowercase letter, uppercaseLetter, number, and symbol"'
    //   };
    //   console.error(this.message);
    // }

    else if (
      this.username === undefined &&
      this.email === undefined &&
      this.password === undefined
    ) {
      this.message = {
        status: 401,
        text: 'Error: "Please fill in all of the inputs above"'
      };
      console.error(this.message);
    } else {
      const user = {
        username : this.username,
        email : this.email,
        password : this.password
      };

      this.userService.registerUser({user})
        .subscribe(data => {
          this.message = {
            status: 200,
            text: 'Success: "Account created"'
          };
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        }, err => {
          this.message = {
            status: err.status,
            text: `Error: ${err._body}`
          };
        });
    }

  }

}
