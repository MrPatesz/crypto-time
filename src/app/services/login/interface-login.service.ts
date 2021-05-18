import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class InterfaceLoginService {

  abstract login(username: string, password: string): string;
}
