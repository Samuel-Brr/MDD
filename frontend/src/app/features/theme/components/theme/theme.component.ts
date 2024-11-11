import { Component } from '@angular/core';
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

interface Theme {
  id: number;
  title: string;
  description: string;
}

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
export class ThemeComponent {
  themes: Theme[] = [
    {
      id: 1,
      title: 'First Theme',
      description: 'This is the content of the first theme...',
    },
    {
      id: 2,
      title: 'First Theme',
      description: 'This is the content of the first theme...',
    },
    {
      id: 3,
      title: 'First Theme',
      description: 'This is the content of the first theme...',
    },
    {
      id: 4,
      title: 'First Theme',
      description: 'This is the content of the first theme...',
    }
    // Add more sample articles...
  ];
}
