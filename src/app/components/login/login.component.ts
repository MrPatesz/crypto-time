import { Component, OnInit } from '@angular/core';
import { ILoginService } from '../../services/login/interface-login.service';
import { MockedLoginService } from '../../services/login/mocked-login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [{ provide: ILoginService, useClass: MockedLoginService }],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(private loginService: ILoginService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    let loggedInAs = this.loginService.login(this.username, this.password);

    if (loggedInAs !== '') {
      localStorage.setItem('loggedInAs', loggedInAs);
      this.router.navigate(['coins']);
    }
  }
}
