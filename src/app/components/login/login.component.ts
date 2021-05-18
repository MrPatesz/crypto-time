import { Component, OnInit } from '@angular/core';
import { InterfaceLoginService } from '../../services/login/interface-login.service';
import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [{ provide: InterfaceLoginService, useClass: LoginService }],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(private loginService: InterfaceLoginService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    let loggedInAs = this.loginService.login(this.username, this.password);

    if (loggedInAs !== '') {
      localStorage.setItem('loggedInAs', loggedInAs);
      this.router.navigate(['coins']);
    }
  }
}
