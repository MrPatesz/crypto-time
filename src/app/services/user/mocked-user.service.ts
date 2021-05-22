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
    if (this.users.find((u) => u.username === username) === undefined) {
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
      (u) => u.username === username && u.password === password
    );

    if (user === undefined) {
      this.register(username, password);
      return '';
    } else {
      return user.username;
    }
  }

  logout(): void {
    localStorage.removeItem('loggedInAs');
  }

  getSavedCoinIds(): string[] {
    let loggedInAs = this.getLoggedInAs();

    return this.users.find((u) => u.username == loggedInAs)?.savedCoinIds ?? [];
  }

  getLoggedInAs(): string {
    return localStorage.getItem('loggedInAs') ?? '';
  }

  saveCoin(coinId: string): void {
    let loggedInAs = this.getLoggedInAs();
    let user = this.users.find((u) => u.username === loggedInAs);

    this.users = this.users.filter((u) => u.username !== loggedInAs);

    if (user !== undefined) {
      user.savedCoinIds.push(coinId);
      this.users.push(user);
    }

    localStorage.setItem('users', JSON.stringify(this.users));
  }

  removeCoin(coinId: string): void {
    let loggedInAs = this.getLoggedInAs();

    let user = this.users.find((u) => u.username === loggedInAs);

    this.users = this.users.filter((u) => u.username !== loggedInAs);

    if (user !== undefined) {
      user.savedCoinIds = user.savedCoinIds.filter((c) => c !== coinId);
      this.users.push(user);
    }

    localStorage.setItem('users', JSON.stringify(this.users));
  }
}
