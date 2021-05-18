import { Injectable } from '@angular/core';

export interface Coin {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export abstract class InterfaceCoinsService {
  abstract getSavedCoinsByUsername(username: string): Coin[];
}
