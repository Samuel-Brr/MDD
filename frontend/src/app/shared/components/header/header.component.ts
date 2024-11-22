import {Component, inject} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {Router, RouterLink} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMobileMenuOpen = false;
  $isLoggedIn = inject(SessionService).$isLogged();
  private router = inject(Router);

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  navigateToProfile(): void {
    this.router.navigate(['/auth/profil']);
  }
}
