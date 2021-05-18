import { Injectable } from '@angular/core';
import { Coin, InterfaceCoinsService } from './interface-coins.service';

interface UserToCoins {
  username: string;
  coins: Coin[];
}

@Injectable({
  providedIn: 'root',
})
export class CoinsService implements InterfaceCoinsService {
  constructor() {}

  getSavedCoinsByUsername(username: string): Coin[] {
    let userToCoinsArray = <UserToCoins[]>(
      JSON.parse(localStorage.getItem('userToCoinsArray') || '[]')
    );

    return userToCoinsArray.find(u => u.username == username)?.coins ?? [];
  }
}
