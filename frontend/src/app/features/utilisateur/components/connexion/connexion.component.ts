import {Component, inject} from '@angular/core';
import {HeaderComponent} from "../../../../shared/components/header/header.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {AuthService} from "../../services/auth.service";
import {SessionService} from "../../../../shared/services/session.service";
import {LoginRequest} from "../../interfaces/loginRequest.interface";
import {SessionInformation} from "../../../../shared/interfaces/sessionInformation.interface";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-connexion',
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
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  private authService: AuthService = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private sessionService: SessionService = inject(SessionService);
  private snackbar = inject(MatSnackBar);
  private readonly PASSWORD_PATTERN = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\\w]).{8,}$';


  loginForm: FormGroup = this.fb.group({
    emailOrUsername: [
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
        Validators.pattern(this.PASSWORD_PATTERN)
      ]
    ]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const loginRequest = this.loginForm.value as LoginRequest;
      this.authService.login(loginRequest).subscribe({
        next: (response: SessionInformation) => {
          this.sessionService.logIn(response);
          this.router.navigate(['/articles']);
        },
        error: () => {
          this.snackbar.open('Erreur lors de la connexion', 'Fermer', {duration: 3000})
        }
      });
    }
  }
}
