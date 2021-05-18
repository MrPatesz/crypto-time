import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinsComponent } from './components/coins/coins.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'coins', component: CoinsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
