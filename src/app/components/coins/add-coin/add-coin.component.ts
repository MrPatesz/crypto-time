import { Component, OnInit } from '@angular/core';
import { CoinsService } from 'src/app/services/coins/coins.service';
import { Coin } from 'src/app/services/coins/interface-coins.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-coin',
  templateUrl: './add-coin.component.html',
  styleUrls: ['./add-coin.component.scss'],
})
export class AddCoinComponent implements OnInit {
  coins: Coin[] = [];
  selectedCoinId: string = '';

  constructor(
    private coinsService: CoinsService,
    public dialogRef: MatDialogRef<string>
  ) {}

  ngOnInit(): void {
    this.coinsService
      .getCoins()
      .subscribe((data: Coin[]) => (this.coins = data.slice(0, 100)));
  }

  cancel() {
    this.dialogRef.close();
  }
}
