import { Injectable } from '@angular/core';
import { Coin, ExchangeItem, ICoinsService } from './interface-coins.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface UserToCoinIds {
  username: string;
  coinIds: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ApiCoinsService implements ICoinsService {
  private readonly BASE_URL = 'https://rest.coinapi.io/v1/';
  private readonly API_KEY = '8CC5740F-5A45-4824-AB0B-C0CBFA30F828'; //'80F87126-EAF7-4CBC-9D3B-17CC8D136633';
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
      user.coinIds = user.coinIds.filter((c) => c !== coinId);
      userToCoinIdsArray.push(user);
    }

    localStorage.setItem(
      'userToCoinIdsArray',
      JSON.stringify(userToCoinIdsArray)
    );
  }

  getCoinById(coinId: string): Coin {
    // MOCKED !!!
    let coins = <Coin[]>JSON.parse(localStorage.getItem('mockedCoins') ?? '[]');

    return coins.find((c) => c.asset_id === coinId)!;
  }

  getLastWeeksExchangeRate(coinId: string): Observable<ExchangeItem[]> {
    return this.http.get<ExchangeItem[]>(
      this.BASE_URL +
        'exchangerate/' +
        coinId +
        '/USD/history?period_id=1DAY&time_start=2021-01-01T00:00:00&time_end=2021-01-08T00:00:00',
      this.HTTP_OPTIONS
    );
  }
}
