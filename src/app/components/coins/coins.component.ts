import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddCoinComponent } from './add-coin/add-coin.component';
import { MatDialog } from '@angular/material/dialog';
import { IUserService } from 'src/app/services/user/interface-user.service';
import { MockedUserService } from 'src/app/services/user/mocked-user.service';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.scss'],
  providers: [{ provide: IUserService, useClass: MockedUserService }],
})
export class CoinsComponent implements OnInit {
  loggedInAs!: string | null;
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

  onLogout() {
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
      }
    });
  }

  removeCoin(coinId: string) {
    this.userService.removeCoin(coinId);
    this.coinIds = this.coinIds.filter((c) => c !== coinId);
    if (this.selectedTabIndex === this.coinIds.length) {
      this.selectedTabIndex--;
    }
  }

  tabChanged(index: number) {
    this.selectedTabIndex = index;
  }
}
