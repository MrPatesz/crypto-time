import { Injectable } from '@angular/core';
import { Coin, InterfaceCoinsService } from './interface-coins.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface UserToCoinIds {
  username: string;
  coinIds: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CoinsService implements InterfaceCoinsService {
  private readonly BASE_URL = 'https://rest.coinapi.io/v1/';
  private readonly API_KEY = '80F87126-EAF7-4CBC-9D3B-17CC8D136633';
  private readonly HTTP_OPTIONS = {
    headers: new HttpHeaders({ 'X-CoinAPI-Key': this.API_KEY }),
  };

  constructor(private http: HttpClient) {}

  getSavedCoinIdsByUsername(username: string): string[] {
    let userToCoinIdsArray = <UserToCoinIds[]>(
      JSON.parse(localStorage.getItem('userToCoinIdsArray') ?? '[]')
    );

    return (
      userToCoinIdsArray.find((u) => u.username == username)?.coinIds ?? []
    );
  }

  getCoins() {
    return this.http.get<Coin[]>(this.BASE_URL + 'assets', this.HTTP_OPTIONS);
  }

  saveCoin(coinId: string, username: string): void {
    let userToCoinIdsArray = <UserToCoinIds[]>(
      JSON.parse(localStorage.getItem('userToCoinIdsArray') ?? '[]')
    );

    let user = userToCoinIdsArray.find((u) => u.username === username);

    userToCoinIdsArray = userToCoinIdsArray.filter(
      (u) => u.username !== username
    );

    if (user !== undefined) {
      user.coinIds.push(coinId);
      userToCoinIdsArray.push(user);
    } else {
      userToCoinIdsArray.push({
        username: username,
        coinIds: [coinId],
      });
    }

    localStorage.setItem(
      'userToCoinIdsArray',
      JSON.stringify(userToCoinIdsArray)
    );
  }
  removeCoin(coinId: string, username: string): void {
    let userToCoinIdsArray = <UserToCoinIds[]>(
      JSON.parse(localStorage.getItem('userToCoinIdsArray') ?? '[]')
    );

    let user = userToCoinIdsArray.find((u) => u.username === username);

    userToCoinIdsArray = userToCoinIdsArray.filter(
      (u) => u.username !== username
    );

    if (user !== undefined) {
      user.coinIds = user.coinIds.filter(c => c !== coinId);
      userToCoinIdsArray.push(user);
    }

    localStorage.setItem(
      'userToCoinIdsArray',
      JSON.stringify(userToCoinIdsArray)
    );
  }
}
