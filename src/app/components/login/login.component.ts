import { Component, OnInit } from '@angular/core';
import { IUserService } from '../../services/user/interface-user.service';
import { MockedUserService } from '../../services/user/mocked-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [{ provide: IUserService, useClass: MockedUserService }],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  loginInvalid: boolean = false;

  constructor(private loginService: IUserService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    let loggedInAs = this.loginService.login(this.username, this.password);

    if (loggedInAs) {
      localStorage.setItem('loggedInAs', loggedInAs);
      this.router.navigate(['coins']);
    } else {
      this.loginInvalid = true;
    }
  }
}
