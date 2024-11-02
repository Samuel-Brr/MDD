import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InscriptionComponent} from "./components/inscription/inscription.component";
import {ConnexionComponent} from "./components/connexion/connexion.component";
import {ProfilComponent} from "./components/profil/profil.component";

const routes: Routes = [
  { title: 'Register', path: 'register', component: InscriptionComponent },
  { title: 'Login', path: 'login', component: ConnexionComponent },
  { title: 'Profil', path: 'profil', component: ProfilComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilisateurRoutingModule { }
