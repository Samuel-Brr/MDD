import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {ArticleService} from "../../services/article.service";
import {Article} from "../../../../shared/interfaces/article.interface";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-creer-article',
  standalone: true,
    imports: [
      ReactiveFormsModule,
      MatCardModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      MatFormFieldModule,
      RouterLink
    ],
  templateUrl: './creer-article.component.html',
  styleUrl: './creer-article.component.css'
})
export class CreerArticleComponent {
  fb = inject(FormBuilder);
  articleService = inject(ArticleService);
  snackBar = inject(MatSnackBar);

  articleForm: FormGroup = this.fb.group({
    theme: ['', [Validators.required]],
    titre: ['', [Validators.required]],
    contenu: ['', [Validators.required]]
  });


  onSubmit() {
    if (this.articleForm.valid) {
      this.articleService.creerArticle(this.articleForm.value as Article).subscribe({
        next: () => {
          this.snackBar.open('Article créé !', 'OK', {duration: 3000});
          this.articleForm.reset();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la création de l\'article', 'Fermer', {duration: 3000});
        }
      });
    }
  }
}
