import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  showNav: boolean;

  constructor(
              private router: Router,
              private userService: UserService
            ) { }

  ngOnInit() {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //     this.showNav = event.url === '/login' || event.url === '/register' ? false : true;
    //   }
    // });
  }

  onLogoutClick() {
    this.userService.logoutUser();
    this.userService.authCheck();
    this.router.navigate(['/login']);
  }

}
