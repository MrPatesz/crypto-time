import { Injectable } from '@angular/core';
import { IUserService } from './interface-user.service';

interface User {
  username: string;
  password: string;
  savedCoinIds: string[];
}

@Injectable({
  providedIn: 'root',
})
export class MockedUserService implements IUserService {
  users: User[];

  constructor() {
    this.users = <User[]>JSON.parse(localStorage.getItem('users') ?? '[]');
  }

  register(username: string, password: string): boolean {
    if (!this.userExists(username)) {
      let newUser = {
        username: username,
        password: password,
        savedCoinIds: [],
      };
      this.users.push(newUser);
      localStorage.setItem('users', JSON.stringify(this.users));

      return true;
    } else {
      return false;
    }
  }

  login(username: string, password: string): string {
    let user = this.users.find(
      (user) => user.username === username && user.password === password
    );

    if (!user) {
      return '';
    } else {
      return user.username;
    }
  }

  userExists(username: string): boolean {
    if (this.users.find((user) => user.username === username)) {
      return true;
    } else {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('loggedInAs');
  }

  getSavedCoinIds(): string[] {
    let loggedInAs = this.getLoggedInAs();

    return (
      this.users.find((user) => user.username == loggedInAs)?.savedCoinIds ?? []
    );
  }

  getLoggedInAs(): string {
    return localStorage.getItem('loggedInAs') ?? '';
  }

  saveCoin(coinId: string): void {
    let loggedInAs = this.getLoggedInAs();
    let user = this.users.find((user) => user.username === loggedInAs);

    if (user) {
      if (!this.getSavedCoinIds().find((savedCoinId) => savedCoinId === coinId))
        user.savedCoinIds.push(coinId);
    }

    localStorage.setItem('users', JSON.stringify(this.users));
  }

  removeCoin(coinId: string): void {
    let loggedInAs = this.getLoggedInAs();
    let user = this.users.find((user) => user.username === loggedInAs);

    if (user) {
      user.savedCoinIds = user.savedCoinIds.filter(
        (savedCoinId) => savedCoinId !== coinId
      );
    }

    localStorage.setItem('users', JSON.stringify(this.users));
  }
}
