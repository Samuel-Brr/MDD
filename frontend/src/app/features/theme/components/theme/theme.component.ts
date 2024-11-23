import {Component, inject, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem} from "@angular/material/menu";
import {Router} from "@angular/router";
import {ThemeService} from "../../services/theme.service";
import {Theme} from "../../../../shared/interfaces/theme";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SessionService} from "../../../../shared/services/session.service";
import {Themes} from "../../../../shared/interfaces/themes";

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [
    DatePipe,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatCardActions
  ],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.css'
})
export class ThemeComponent implements OnInit {
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private snackBar = inject(MatSnackBar);
  private idUtilisateur = inject(SessionService).sessionInformation!.id;

  themes: Theme[] = [];
  url = this.router.url;

  ngOnInit() {
    this.initialiserThemes();
  }

  private initialiserThemes() {
    this.url = this.router.url;
    if (this.url === '/themes') {
      this.themeService.getThemes().subscribe({
        next: (themes: Themes) => this.themes = themes.themes,
        error: () => this.snackBar.open('Erreur lors du chargement des thèmes', 'Fermer', {duration: 3000})
      })
    } else if (this.url === '/auth/profil') {
      this.themeService.getThemes().subscribe({
        next: (themes: Themes) => this.themes = themes.themes.filter(theme => theme.abonnes.includes(this.idUtilisateur)),
        error: () => this.snackBar.open('Erreur lors du chargement des thèmes', 'Fermer', {duration: 3000})
      })
    }
  }

  onSubscribe(id: number) {
    this.themeService.subscribeTheme(id).subscribe({
      next: () => {
        this.snackBar.open('Vous êtes abonné à ce thème', 'Fermer', {duration: 3000});
      },
      error: () => this.snackBar.open('Erreur lors de l\'abonnement au thème', 'Fermer', {duration: 3000})
    })
  }

  onUnsubscribe(id: number) {
    this.themeService.unsubscribeTheme(id).subscribe({
      next: () => {
        this.snackBar.open('Vous êtes désabonné de ce thème', 'Fermer', {duration: 3000});
        this.initialiserThemes();
      },
      error: () => this.snackBar.open('Erreur lors de la désabonnement du thème', 'Fermer', {duration: 3000})
    })
  }
}
