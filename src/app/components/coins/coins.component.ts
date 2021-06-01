import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddCoinComponent } from './add-coin/add-coin.component';
import { MatDialog } from '@angular/material/dialog';
import { IUserService } from 'src/app/services/user/interface-user.service';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.scss'],
})
export class CoinsComponent implements OnInit {
  loggedInAs!: string;
  coinIds: string[] = [];
  selectedTabIndex: number = 0;

  constructor(
    private userService: IUserService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loggedInAs = this.userService.getLoggedInAs();
    this.coinIds = this.userService.getSavedCoinIds();
  }

  onLogout(): void {
    this.userService.logout();
    this.router.navigate(['login']);
  }

  addCoin(): void {
    const dialogRef = this.dialog.open(AddCoinComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((coin) => {
      if (coin) {
        this.userService.saveCoin(coin);
        if (this.coinIds.length === 1) {
          this.selectedTabIndex = 1;
          setTimeout(()=>{ this.selectedTabIndex = 0 }, 300)
        }
      }
    });
  }

  removeCoin(coinId: string): void {
    this.userService.removeCoin(coinId);
    this.coinIds = this.coinIds.filter((id) => id !== coinId);
    if (this.selectedTabIndex === this.coinIds.length) {
      this.selectedTabIndex--;
    }
  }
}
