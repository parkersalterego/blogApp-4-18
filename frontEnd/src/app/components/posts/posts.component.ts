import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PostsService } from '../../services/posts.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts = [];

  constructor(
              private postsService: PostsService,
              private userService: UserService,
              private router: Router
            ) {}

  ngOnInit() {

  }


}
