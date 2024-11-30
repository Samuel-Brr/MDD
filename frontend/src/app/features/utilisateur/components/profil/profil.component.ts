import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {Router, RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {ThemeComponent} from "../../../theme/components/theme/theme.component";
import {AuthService} from "../../services/auth.service";
import {Credentials} from "../../interfaces/credentials.interface";
import {SessionService} from "../../../../shared/services/session.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    RouterLink,
    ThemeComponent
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private sessionService = inject(SessionService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    this.authService.getCredentials().subscribe({
      next: (credentials) => {
        this.form.patchValue(credentials);
      },
      error: () => {
        this.snackBar.open('Erreur lors de la récupération des crédentials', 'Fermer', {duration: 3000})
      }
    })
  }

  onSubmit() {
    if (this.form.valid) {
      const credentials = this.form.value as Credentials;
      this.authService.updateCredentials(credentials).subscribe({
        next: (res) => {
          const {token, id} = res;
          const {username, email} = res
          this.form.patchValue({username, email});
          this.sessionService.logIn({token, id});
          this.snackBar.open('Profil mis à jour', 'OK', {duration: 3000});
        },
        error: () => this.snackBar.open('Une erreur est survenue', 'Fermer', {duration: 3000})
      });
    }
  }

  onLogout() {
    this.sessionService.logOut();
    this.router.navigate(['/']);
  }
}
