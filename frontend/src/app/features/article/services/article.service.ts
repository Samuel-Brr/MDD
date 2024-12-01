import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Articles} from "../../../shared/interfaces/articles";
import {Article} from "../../../shared/interfaces/article.interface";
import {I_Comment} from "../../../shared/interfaces/comment.interface";
import {SessionService} from "../../../shared/services/session.service";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private pathService = 'api/articles';
  private httpClient: HttpClient = inject(HttpClient);
  private userId = inject(SessionService).sessionInformation?.id;

  public getArticles(): Observable<Articles> {
    return this.httpClient.get<Articles>(`${this.pathService}/user/${this.userId}`);
  }

  creerArticle(article: Article): Observable<number>{
    return this.httpClient.post<number>(`${this.pathService}`, article);
  }

  getById(articleId: string): Observable<Article> {
    return this.httpClient.get<Article>(`${this.pathService}/${articleId}`);
  }

  ajouterCommentaire(articleId: number, commentaire: I_Comment): Observable<number> {
    return this.httpClient.post<number>(`${this.pathService}/${articleId}`, commentaire);
  }
}
