import {Component} from '@angular/core';
import {Article} from "../../../../shared/interfaces/article.interface";
import {RouterLink} from "@angular/router";
import {I_Comment} from "../../../../shared/interfaces/comment.interface";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {DatePipe} from "@angular/common";

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
export class ArticleDetailComponent {

  comment: I_Comment = {
    id: 1,
    content: 'This is a comment',
    author: 'Jane Doe'
  }

  article: Article = {
    id: 1,
    title: 'First Article',
    content: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Praesent quam elit tempus eleifend tellus mi hendrerit. At metus justo dictum nunc ex sagittis; erat egestas. Habitasse felis facilisis ex diam duis. Curae auctor et pulvinar natoque ex curabitur. Tristique fames fames rutrum nisi metus. Suspendisse ridiculus aptent rutrum facilisis fusce eleifend. Dui vitae dis fusce odio nullam. Id vehicula arcu in malesuada purus a rutrum.',
    author: 'John Doe',
    date: new Date(),
    theme: "web dev",
    comments: [this.comment]
  }

  commentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      comment: [''],
    });
  }

  onSubmit() {
    if (this.commentForm.valid) {
      console.log(this.commentForm.value);
      // Implement your login logic here
    }
  }

  clickEvent($event: MouseEvent) {

  }
}
