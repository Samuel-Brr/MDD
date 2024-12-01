import { Injectable } from '@angular/core';
import { SessionInformation } from "../interfaces/sessionInformation.interface";
import { BehaviorSubject, Observable } from "rxjs";

const SESSION_KEY = 'session_info';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private isLoggedSubject = new BehaviorSubject<boolean>(false);
  public isLogged = false;
  public sessionInformation: SessionInformation | undefined;

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession) as SessionInformation;
        if (parsedSession.token && parsedSession.id) {
          this.sessionInformation = parsedSession;
          this.isLogged = true;
          this.isLoggedSubject.next(true);
        } else {
          this.clearStorage();
        }
      } catch (e) {
        console.error('Error parsing stored session:', e);
        this.clearStorage();
      }
    }
  }

  private clearStorage(): void {
    console.log('Clearing session storage');
    localStorage.removeItem(SESSION_KEY);
  }

  public $isLogged(): Observable<boolean> {
    return this.isLoggedSubject.asObservable();
  }

  public logIn(user: SessionInformation): void {
    this.sessionInformation = user;
    this.isLogged = true;
    // Store in localStorage
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    this.isLoggedSubject.next(true);
  }

  public logOut(): void {
    this.sessionInformation = undefined;
    this.isLogged = false;
    this.clearStorage();
    this.isLoggedSubject.next(false);
  }
}
