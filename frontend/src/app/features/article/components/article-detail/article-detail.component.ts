import {Component, inject, OnInit} from '@angular/core';
import {Article} from "../../../../shared/interfaces/article.interface";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {I_Comment} from "../../../../shared/interfaces/comment.interface";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {DatePipe} from "@angular/common";
import {ArticleService} from "../../services/article.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css'
})
export class ArticleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private articleService = inject(ArticleService);
  private snackBar = inject(MatSnackBar);

  commentForm: FormGroup = this.fb.group({
    contenu: ['', Validators.required],
  });

  article: Article = {} as any;

  ngOnInit(): void {
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.initialiserArticle(articleId);
    } else {
      this.snackBar.open('Error: Article ID not found', 'Close', {duration: 3000});
    }
  }

  private initialiserArticle(articleId: string) {
    this.articleService.getById(articleId).subscribe({
      next: (article: Article) => {
        this.article = article;
      },
      error: () => {
        this.snackBar.open('Erreur lors de la récupération de l\'article', 'Close', {duration: 3000});
      }
    })
  }

  onSubmit() {
    if (this.commentForm.valid) {
      console.log(this.commentForm.value);
      this.articleService.ajouterCommentaire(this.article.id, this.commentForm.value as I_Comment).subscribe({
        next: () => {
          this.snackBar.open('Commentaire ajouté !', 'OK', {duration: 3000});
          this.commentForm.reset();
          this.initialiserArticle(this.article.id.toString());
        },
        error: () => {
          this.snackBar.open('Erreur lors de l\'ajout du commentaire', 'Fermer', {duration: 3000});
        }
      })
    }
  }
}
