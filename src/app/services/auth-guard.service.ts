import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { MockedUserService } from './user/mocked-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(public userService: MockedUserService, public router: Router) {}

  canActivate() {
    if (!this.userService.getLoggedInAs()) {
      this.router.navigate(['login']);
      return false;
    } else {
      return true;
    }
  }
}
