import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Coin,
  InterfaceCoinsService,
} from '../../services/coins/interface-coins.service';
import { CoinsService } from '../../services/coins/coins.service';
import { AddCoinComponent } from './add-coin/add-coin.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.scss'],
  providers: [{ provide: InterfaceCoinsService, useClass: CoinsService }],
})
export class CoinsComponent implements OnInit {
  constructor(
    private coinsService: InterfaceCoinsService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  loggedInAs: string = '';
  coinIds: string[] = [];
  selectedCoin: Coin = {
    asset_id: 'BTC',
    data_end: '2021-05-19',
    data_orderbook_end: '2020-08-05T14:38:38.3413202Z',
    data_orderbook_start: '2014-02-24T17:43:05.0000000Z',
    data_quote_end: '2021-05-19T14:25:49.1672942Z',
    data_quote_start: '2014-02-24T17:43:05.0000000Z',
    data_start: '2010-07-17',
    data_symbols_count: 54352,
    data_trade_end: '2021-05-19T14:15:03.6266667Z',
    data_trade_start: '2010-07-17T23:09:17.0000000Z',
    id_icon: '4caf2b16-a017-4e26-a348-2cea69c34cba',
    name: 'Bitcoin',
    price_usd: 35125.388332863266,
    type_is_crypto: 1,
    volume_1day_usd: 5836257165296485,
    volume_1hrs_usd: 214183542757792.47,
    volume_1mth_usd: 161227803305110850,
  };
  usdValue: number = 0;
  coinValue: number = 0;

  ngOnInit(): void {
    this.loggedInAs = localStorage.getItem('loggedInAs') || '';

    this.coinIds = this.coinsService.getSavedCoinIdsByUsername(this.loggedInAs);
  }

  onLogout() {
    localStorage.removeItem('loggedInAs');
    this.router.navigate(['login']);
  }

  addCoin(): void {
    const dialogRef = this.dialog.open(AddCoinComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((coin) => {
      if (coin) {
        let loggedInAs = localStorage.getItem('loggedInAs');

        if (loggedInAs) this.coinsService.saveCoin(coin, loggedInAs);
      }
    });
  }

  @ViewChild('tabGroup') private tabGroup!: MatTabGroup;

  onTabChange() {
    let index = this.tabGroup.selectedIndex ?? 0;

    let coinId = this.coinIds[index];

    this.selectedCoin = this.coinsService.getCoinById(coinId);

    this.usdValue = 0;
    this.coinValue = 0;
  }

  removeCoin(coinId: string) {
    let loggedInAs = localStorage.getItem('loggedInAs');

    if (loggedInAs) this.coinsService.removeCoin(coinId, loggedInAs);
  }

  usdValueChanged() {
    this.coinValue = this.usdValue / this.selectedCoin.price_usd;
  }

  coinValueChanged() {
    this.usdValue = this.coinValue * this.selectedCoin.price_usd;
  }
}
