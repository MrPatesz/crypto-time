import { Component, OnInit } from '@angular/core';
import { IUserService } from '../../services/user/interface-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  loginInvalid: boolean = false;
  registered: boolean = false;

  constructor(private userService: IUserService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.loginInvalid = false;

    let userExists = this.userService.userExists(this.username);

    if (userExists) {
      this.login();
    } else {
      this.userService.register(this.username, this.password);
      this.login();
    }
  }

  private login() {
    let loggedInAs = this.userService.login(this.username, this.password);

    if (loggedInAs) {
      localStorage.setItem('loggedInAs', loggedInAs);
      this.router.navigate(['coins']);
    } else {
      this.loginInvalid = true;
    }
  }
}
