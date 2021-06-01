import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { CoinsComponent } from './components/coins/coins.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { AddCoinComponent } from './components/coins/add-coin/add-coin.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CoinDetailsComponent } from './components/coins/coin-details/coin-details.component';
import { CoinsRealTimeComponent } from './components/coins/coins-real-time/coins-real-time.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { IUserService } from './services/user/interface-user.service';
import { MockedUserService } from './services/user/mocked-user.service';
import { ICoinsService } from './services/coins/interface-coins.service';
import { ApiCoinsService } from './services/coins/api-coins.service';
import { MockedCoinsService } from './services/coins/mocked-coins.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CoinsComponent,
    AddCoinComponent,
    CoinDetailsComponent,
    CoinsRealTimeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatTabsModule,
    MatDialogModule,
    HttpClientModule,
    MatSelectModule,
    NgxChartsModule,
    MatTableModule,
    MatIconModule,
  ],
  providers: [
    { provide: IUserService, useClass: MockedUserService },
    { provide: ICoinsService, useClass: MockedCoinsService }, // ApiCoinsService }, //
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
