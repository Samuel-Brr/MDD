import { Component } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {DatePipe} from "@angular/common";
import {HeaderComponent} from "../../../../shared/components/header/header.component";

export interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  date: Date;
}

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
// Sample data - would normally come from a service
  articles: Article[] = [
    {
      id: 1,
      title: 'First Article',
      content: 'This is the content of the first article...',
      author: 'John Doe',
      date: new Date()
    },
    {
      id: 2,
      title: 'First Article',
      content: 'This is the content of the first article...',
      author: 'John Doe',
      date: new Date()
    },
    {
      id: 3,
      title: 'First Article',
      content: 'This is the content of the first article...',
      author: 'John Doe',
      date: new Date()
    },
    {
      id: 4,
      title: 'First Article',
      content: 'This is the content of the first article...',
      author: 'John Doe',
      date: new Date()
    }
    // Add more sample articles...
  ];

  createArticle(): void {
    // Implement article creation logic
    console.log('Creating new article...');
  }

  sortArticles(criteria: string): void {
    // Implement sorting logic
    console.log(`Sorting by ${criteria}...`);
  }
}
