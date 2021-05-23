import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Coin } from 'src/app/models/coin';
import { ICoinsService } from 'src/app/services/coins/interface-coins.service';
import { ApiCoinsService } from 'src/app/services/coins/api-coins.service';
import { MockedCoinsService } from 'src/app/services/coins/mocked-coins.service';

@Component({
  selector: 'app-add-coin',
  templateUrl: './add-coin.component.html',
  styleUrls: ['./add-coin.component.scss'],
  providers: [{ provide: ICoinsService, useClass: ApiCoinsService }], // MockedCoinsService }], //
})
export class AddCoinComponent implements OnInit {
  coins: Coin[] = [];
  selectedCoinId: string = '';

  constructor(
    private coinsService: ICoinsService,
    public dialogRef: MatDialogRef<string>
  ) {}

  ngOnInit(): void {
    this.coinsService.getCoins().subscribe((data: Coin[]) => {
      data = data.filter((c) => c.type_is_crypto);
      this.coins = data.slice(0, 100);
      this.persisMockData();
    });
  }

  private persisMockData() {
    localStorage.setItem('mockedCoins', JSON.stringify(this.coins));
  }

  cancel() {
    this.dialogRef.close();
  }
}
