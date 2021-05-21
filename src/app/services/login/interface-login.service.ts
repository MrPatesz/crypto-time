import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class ILoginService {

  abstract login(username: string, password: string): string;
}
