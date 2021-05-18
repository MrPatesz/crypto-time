import { Injectable } from '@angular/core';
import { InterfaceLoginService } from './interface-login.service';

interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService implements InterfaceLoginService {
  constructor() {}

  login(username: string, password: string): string {
    let userArray = <User[]>JSON.parse(localStorage.getItem('users') || '[]');

    let user = userArray.find(
      (u) => u.username === username && u.password === password
    );

    if (user === undefined) {
      let newUser = { username: username, password: password };
      userArray.push(newUser);
      localStorage.setItem('users', JSON.stringify(userArray));
      return '';
    } else {
      return user.username;
    }
  }
} 
