import {Component, inject} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {RegisterRequest} from "../../interfaces/registerRequest.interface";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-inscription',
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
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private snackbar = inject(MatSnackBar);

  signupForm: FormGroup = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(40)
      ]
    ]
  });

  onSubmit() {
    if (this.signupForm.valid) {
      const registerRequest = this.signupForm.value as RegisterRequest;
      this.authService.register(registerRequest).subscribe({
          next: (_: void) => this.router.navigate(['/auth/login']),
          error: _ => this.snackbar.open('Erreur lors de l\'enregistrement', 'Fermer', {duration: 3000})
        }
      );
    }
  }
}
