import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/utilisateur/utilisateur.module').then(m => m.UtilisateurModule)
  },
  {
    path: 'articles',
    loadChildren: () => import('./features/article/article.module').then(m => m.ArticleModule)
  },
  {
    path: 'themes',
    loadChildren: () => import('./features/theme/theme.module').then(m => m.ThemeModule)
  }
];
