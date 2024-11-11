import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {RouterLink} from "@angular/router";
import {HeaderComponent} from "../../../../shared/components/header/header.component";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-creer-article',
  standalone: true,
    imports: [
      HeaderComponent,
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
  createForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm = this.fb.group({
      theme: ['', [Validators.required]],
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.createForm.valid) {
      console.log(this.createForm.value);
      // Implement your signup logic here
    }
  }
}
