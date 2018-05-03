import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  email: String;
  password: String;

  constructor(
              private userService: UserService,
              private router: Router
  ) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    this.userService.loginUser({email: this.email, password: this.password})
      .subscribe(data => {
        console.log(data);
      }, err => {
        console.log(err);
      });
  }


}
