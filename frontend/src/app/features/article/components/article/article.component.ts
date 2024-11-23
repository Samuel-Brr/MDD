import {Component, inject, OnInit} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {DatePipe} from "@angular/common";
import {HeaderComponent} from "../../../../shared/components/header/header.component";
import {Article} from "../../../../shared/interfaces/article.interface";
import {Router} from "@angular/router";
import {ArticleService} from "../../services/article.service";
import {Articles} from "../../../../shared/interfaces/articles";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule, DatePipe, HeaderComponent
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit {
  private router = inject(Router);
  private articleService = inject(ArticleService);
  private snackBar = inject(MatSnackBar);

  articles: Article[] = [];

  ngOnInit(): void {
    this.articleService.getArticles().subscribe({
      next: (articles: Articles) => this.articles = this.sortArticles(articles.articles),
      error: () => {
        this.snackBar.open('Erreur lors du chargement des articles', 'Fermer', {duration: 3000});
        console.error('Error loading articles');
      }
    })
  }

  private sortArticles(articles: Article[]): Article[] {
    return [...articles].sort((a, b) => {
      // Convert to timestamps for reliable comparison
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      // Sort in descending order (newest first)
      return dateB - dateA;
    });
  }

  navigateToCreerArticle(): void {
    this.router.navigate(['/articles/creer']);
  }
  navigateToArticle(articleId: number): void {
    this.router.navigate(['/articles/detail', articleId]);
  }
}
