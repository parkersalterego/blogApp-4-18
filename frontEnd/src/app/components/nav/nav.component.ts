import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(
              private router: Router,
              private userService: UserService
            ) { }

  ngOnInit() {
  }

  onLogoutClick() {
    this.userService.logoutUser();
    this.router.navigate(['/login']);
  }

}
