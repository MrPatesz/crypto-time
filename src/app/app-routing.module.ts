import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinsComponent } from './coins/coins.component';
import { LoginComponent } from './login/login.component';

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
