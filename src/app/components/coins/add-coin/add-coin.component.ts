import { Component, OnInit } from '@angular/core';
import { Coin } from 'src/app/models/coin';
import { ICoinsService } from 'src/app/services/coins/interface-coins.service';

@Component({
  selector: 'app-add-coin',
  templateUrl: './add-coin.component.html',
  styleUrls: ['./add-coin.component.scss'],
})
export class AddCoinComponent implements OnInit {
  coins: Coin[] = [];
  selectedCoinId: string = '';

  constructor(private coinsService: ICoinsService) {}

  ngOnInit(): void {
    this.coinsService.getCoins().subscribe((coins: Coin[]) => {
      coins = coins.filter((coin) => coin.type_is_crypto);
      this.coins = coins.slice(0, 100);
    });
  }
}
