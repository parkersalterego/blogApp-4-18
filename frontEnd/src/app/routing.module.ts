import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { PostsComponent } from './components/posts/posts.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';

import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'posts',
    component: PostsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthGuard,
  ]
})
export class RoutingModule { }
