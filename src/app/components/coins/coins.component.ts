import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  InterfaceCoinsService,
  Coin,
} from '../../services/coins/interface-coins.service';
import { CoinsService } from '../../services/coins/coins.service';
import { AddCoinComponent } from './add-coin/add-coin.component';
import { MatDialog } from '@angular/material/dialog';

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
  coins: Coin[] = [];

  ngOnInit(): void {
    this.loggedInAs = localStorage.getItem('loggedInAs') || '';

    this.coins = this.coinsService.getSavedCoinsByUsername(this.loggedInAs);
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
      console.log(coin);
    });
  }
}
