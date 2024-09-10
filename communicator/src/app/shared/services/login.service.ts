import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

   private loginDataSubject = new BehaviorSubject<any>(null);
  
   loginData$: Observable<any> = this.loginDataSubject.asObservable();

  constructor() { }

  setLoginData(loginData: any): void {
    this.loginDataSubject.next(loginData);
  }

  clearLoginData(): void {
    this.loginDataSubject.next(null);
  }

  getCurrentLoginData(): any {
    return this.loginDataSubject.value;
  }

}
