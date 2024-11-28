import { Component, input } from '@angular/core';
import { TeamMember } from '../../models/Player';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-team-board',
  standalone: true,
  imports: [CommonModule, BadgeModule],
  templateUrl: './team-board.component.html',
  styleUrl: './team-board.component.css',
})
export class TeamBoardComponent {
  teamName = input.required<string>();
  elo = input<number>();
  memberList = input.required<TeamMember[]>();
  win = input(false);
  isSmall = input(false);
}
