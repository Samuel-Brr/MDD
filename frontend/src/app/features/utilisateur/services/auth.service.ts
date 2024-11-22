import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterRequest} from "../interfaces/registerRequest.interface";
import {Observable} from "rxjs";
import {LoginRequest} from "../interfaces/loginRequest.interface";
import {SessionInformation} from "../../../shared/interfaces/sessionInformation.interface";
import {Credentials} from "../interfaces/credentials.interface";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private pathService = 'api/auth';
  private httpClient: HttpClient = inject(HttpClient);

  public getCredentials(): Observable<Credentials> {
    return this.httpClient.get<Credentials>(`${this.pathService}/credentials`);
  }

  public updateCredentials(credentials: Credentials): Observable<void> {
    return this.httpClient.put<void>(`${this.pathService}/credentials`, credentials);
  }

  public register(registerRequest: RegisterRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.pathService}/register`, registerRequest);
  }

  public login(loginRequest: LoginRequest): Observable<SessionInformation> {
    return this.httpClient.post<SessionInformation>(`${this.pathService}/login`, loginRequest);
  }

  public logout() {
    return this.httpClient.post<void>(`${this.pathService}/logout`,null);
  }
}
