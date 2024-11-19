import { Component, input } from '@angular/core';
import { TeamMember } from '../../models/Player';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [CommonModule, BadgeModule],
  templateUrl: './board-column.component.html',
  styleUrl: './board-column.component.css',
})
export class BoardColumnComponent {
  teamName = input.required<string>();
  score = input.required<number>();
  memberList = input.required<TeamMember[]>();
  win = input(false);
  isSmall = input(false);
}
