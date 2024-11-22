import {Component, inject} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {DatePipe} from "@angular/common";
import {HeaderComponent} from "../../../../shared/components/header/header.component";
import {Article} from "../../../../shared/interfaces/article.interface";
import {I_Comment} from "../../../../shared/interfaces/comment.interface";
import {Router} from "@angular/router";

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
export class ArticleComponent {
  private router = inject(Router);

// Sample data - would normally come from a service
  comment: I_Comment = {
    id: 1,
    content: 'This is a comment',
    author: 'Jane Doe'
  }
  articles: Article[] = [
    {
      id: 1,
      title: 'First Article',
      content: 'This is the content of the first article...',
      author: 'John Doe',
      date: new Date(),
      theme: "web dev",
      comments: [this.comment]
    },
    {
      id: 2,
      title: 'First Article',
      content: 'This is the content of the first article...',
      author: 'John Doe',
      date: new Date(),
      theme: "web dev",
      comments: [this.comment]
    },
    {
      id: 3,
      title: 'First Article',
      content: 'This is the content of the first article...',
      author: 'John Doe',
      date: new Date(),
      theme: "web dev",
      comments: [this.comment]
    },
    {
      id: 4,
      title: 'First Article',
      content: 'This is the content of the first article...',
      author: 'John Doe',
      date: new Date(),
      theme: "web dev",
      comments: [this.comment]
    }
    // Add more sample articles...
  ];

  navigateToCreerArticle(): void {
    this.router.navigate(['/articles/creer']);
  }

  sortArticles(criteria: string): void {
    // Implement sorting logic
    console.log(`Sorting by ${criteria}...`);
  }

  navigateToArticle(articleId: number): void {
    this.router.navigate(['/articles/detail', articleId]);
  }
}
