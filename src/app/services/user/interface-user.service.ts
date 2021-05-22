import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class IUserService {
  abstract register(username: string, password: string): boolean;

  abstract login(username: string, password: string): string;

  abstract logout(): void;

  abstract getSavedCoinIds(): string[];

  abstract saveCoin(coinId: string): void;

  abstract removeCoin(coinId: string): void;

  abstract getLoggedInAs(): string;
}
