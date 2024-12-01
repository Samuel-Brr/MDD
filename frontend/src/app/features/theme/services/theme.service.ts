import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Themes} from "../../../shared/interfaces/themes";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private pathService = 'api/themes';
  private httpClient: HttpClient = inject(HttpClient);

  public getThemes(): Observable<Themes> {
    return this.httpClient.get<Themes>(`${this.pathService}`);
  }

  public subscribeTheme(themeId: number) {
    return this.httpClient.post(`${this.pathService}/subscribe/${themeId}`, null);
  }

  public unsubscribeTheme(themeId: number) {
    return this.httpClient.post(`${this.pathService}/unsubscribe/${themeId}`, null);
  }
}
